d2gApp.controller("profileController", function (loginService, bookingService, requestService, $http, $location, $filter, Upload) {
	var vm = this;
	var loginSvc = loginService;
	var bookingSvc = bookingService;
	var requestSvc = requestService;

	var shouldHide = false;

	function loadUser () {
		if(loginSvc.getUser()) {
			vm.user = loginSvc.getUser();
		}
	}
	
	function getUserBookings () {
		bookingSvc.getBookingsByUserId(vm.user.id).then(function (data) {
			vm.hostbookings = data.data.bookings;
			vm.hostrequests = data.data.requests;
		})
	}

	function getGuestBookings () {
		bookingSvc.getGuestBookingsById(vm.user.id).then(function (data) {
			vm.guestbookings = data.data.bookings;
			vm.guestrequests = data.data.requests;

			if(vm.guestrequests) {
				for(var i=0; i < vm.guestrequests.length; i++) {
					var newdate = splitDateTime(vm.guestrequests[i].date_time);
					vm.guestrequests[i].date = newdate[0];
					vm.guestrequests[i].time = newdate[1];
				}
			}
		}) 
	}

	function splitDateTime(datetime) {
		var datetimesplit = datetime.split(" ");
		var date = datetimesplit[0];
		var datesplit = date.split("-");

		var newdate = datesplit[2] + "/" + datesplit[1] + "/" + datesplit[0];
		var time = datetimesplit[1].substring(0,5);

		return [newdate, time];
	}

	vm.acceptRequest = function (requestid, userid, bookingid) {
		requestSvc.acceptRequest(requestid).then(function () {
			var data = {
				user_id: userid,
				host_id: vm.user.id,
				booking_id: bookingid
			}
			$http.post("api/sendconfirmationrequestmail", data).then( function () {
				swal({
					text: "Request was accepted. User is booked and will get a notification.",
					type: "success"
				})
				getUserBookings();

			});

		}, function () {
			swal({
				text: "We're so sorry, for some reasons we couldn't accept this request. Please try again or contact us if this problem keeps occuring.",
				type: "error"
			})
		})
	}

	vm.declineRequest = function (id) {
		requestSvc.declineRequest(id).then(function () {
			swal({
				text: "Request was declined. We'll notificate the user",
				type: "success"
			})
			getUserBookings();
		}, function () {
			swal({
				text: "We're so sorry, for some reasons we couldn't decline this request. Please try again or contact us if this problem keeps occuring.",
				type: "error"
			})
		})
	}

	vm.deleteBooking = function (id) {
		bookingSvc.deleteBooking(id).then(function()
		{
			getUserBookings();
		});
	}

	vm.deleteUserRequest = function (id) {
		requestSvc.deleteRequest(id).then(function () {
			swal({
				title: "Request deleted",
				type: "success"
			});
			getGuestBookings();
		}, function () {
			swal({
				title: "Couldn't delete request",
				text: "We couldn't delete your request. Try again later or contact us if this problem keeps occuring",
				type: "error"
			})
		});
	}

	vm.detachFromBooking = function (id, userid) {
		var user = loginSvc.getUser();
		bookingSvc.detachBooking(id, user.id).then(function()
		{
			getGuestBookings();
		});
	}

	vm.saveProfile = function() {
		var data = {
			first_name: vm.user.first_name,
			last_name: vm.user.last_name,
			email: vm.user.email,
			street_number: vm.user.street_number,
			postalcode: vm.user.postalcode,
			city: vm.user.city,
		};
		loginSvc.updateProfile(vm.user.id,data).then(function(data) {
			if ( data.status == 200)
			{
				vm.showsuccessmessage = true;
				loginSvc.setUser();
			}
		}, function (error) {
			vm.showerrormessage = true;
		});
	}

	vm.uploadProfilePicture = function (file) {
		Upload.upload({
			url: '/api/profile/upload',
			data: 
			{
				file	: file,
				user_id	: vm.user.id
			}
			}).then(function (data) {
				loginSvc.setUser();
				vm.user.image = data.data.filename;
				vm.path = '';
			}); 
	}

	function _init() {
		if(!loginSvc.getUser()) {
			loginSvc.errorMessage = "You need to be logged in to see your profile";
			$location.path('/home');
		} else {
			loadUser();
			getUserBookings();
			getGuestBookings();
		}
	}
	_init();
});