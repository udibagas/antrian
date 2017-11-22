var API_URL = 'http://192.168.42.76:8001/api/';
var API_TOKEN = window.localStorage.getItem("API_TOKEN") || null;

ons.bootstrap()

.controller('MainController', function($scope, $http) {

    $scope.geolocation = null

    ons.ready(function() {

        AdvancedGeolocation.start(function(success){

            try {
                var geolocation = JSON.parse(success);

                if (geolocation.provider == "gps" || geolocation.provider == "network") {
                    $scope.$apply(function() {
                        $scope.geolocation = geolocation;
                    });
                }
            }

            catch(exc){
                console.log("Invalid JSON: " + exc);
            }
        },
        function(error){
            console.log("ERROR! " + JSON.stringify(error));
        },
        {
            "minTime":1000,         // Min time interval between updates (ms)
            "minDistance":1,       // Min distance between updates (meters)
            "noWarn":true,         // Native location provider warnings
            "providers":"all",     // Return GPS, NETWORK and CELL locations
            "useCache":true,       // Return GPS and NETWORK cached locations
            "satelliteData":false, // Return of GPS satellite info
            "buffer":false,        // Buffer location data
            "bufferSize":0,        // Max elements in buffer
            "signalStrength":false // Return cell signal strength data
        });

        window.plugins.spinnerDialog.show(null, "Initializing..");

        $http.post(API_URL + "loginByDevice",  {device_id: device.uuid})

        .then(function(res) {
            window.plugins.spinnerDialog.hide();

            if (res.data == "") {
                navi.resetToPage('register.html');
            }

            else {
                if (res.data.active == 0) {
                    ons.notification.alert("Akun anda di suspend. Silakan hubungi contact center kami.");
                    navi.resetToPage('login.html');
                }

                // login sukses, ambil data dari server
                else {
                    API_TOKEN = res.data.api_token;
                    window.localStorage.setItem("API_TOKEN", res.data.api_token);
                    navi.resetToPage('main.html');
                }
            }

        }, function(e) {
            navi.resetToPage('login.html');
            window.plugins.spinnerDialog.hide();
            navigator.notification.alert("Koneksi ke server gagal! Silakan coba beberapa saat lagi. " + JSON.stringify(e));
        });

    });

})

.controller('AppController', function($scope, $http) {

    $scope.locations = [];
    $scope.reservations = [];
    $scope.notifications = [];

    this.getReservations = function() {
        $http.get(API_URL + "reservation?api_token=" + API_TOKEN)
        .then(function(res) {
            $scope.reservations = res.data;
        }.bind(this));
    };

    this.showReservation = function(reservation) {
        navi.pushPage('reservation-detail.html', {
            reservation: reservation
        });
    };

    this.getLocations = function() {
        $http.get(API_URL + 'location?api_token=' + API_TOKEN)
        .then(function(res) {
            $scope.locations = res.data;
        }.bind(this));
    };

    this.showLocation = function(location) {
        navi.pushPage('location-detail.html', {
            location: location
        });
    };

    this.getNotifications = function() {
        $http.get(API_URL + 'notification?api_token=' + API_TOKEN)
        .then(function(res) {
            $scope.notifications = res.data;
        }.bind(this));
    };

    this.showNotification = function(notification) {
        navi.pushPage('notification-detail.html', {
            notification: notification
        });
    };

    this.newReservation = function() {
        navi.pushPage('new-reservation.html', {
            locations: $scope.locations
        });
    };

    this.refreshPage = function(page) {
        switch (page) {
            case 'reservation':
                this.title = 'My Reservation';
                this.getReservations();
                break;
            case 'location':
                this.title = 'Locations';
                this.getLocations();
                break;
            case 'notification':
                this.title = 'Notifications';
                this.getNotifications();
                break;
            default:
                break;
        }
    };

})

.controller('RegisterCtrl', function($scope, $http) {
    this.register = function() {

        $scope.errors = {name: [], email: [], phone: [], password: []};
        window.plugins.spinnerDialog.show(null, "Registering...");

        $http.post(API_URL + "register", {
            name        : $scope.name,
            email       : $scope.email,
            phone       : $scope.phone,
            password    : $scope.password,
            device_id   : device.uuid,
            fcm         : 'xxx'
        })

        .then(function(res) {

            window.plugins.spinnerDialog.hide();
            API_TOKEN = res.data.api_token;
            window.localStorage.setItem("API_TOKEN", res.data.api_token);
            navi.resetToPage('main.html');
            ons.notification.alert('Pendaftaran berhasil.');

        }, function(e) {
            window.plugins.spinnerDialog.hide();
            if (e.status == 422) {
                $scope.errors = e.data;
            } else {
				ons.notification.alert('Koneksi ke server gagal. Silakan coba beberapa saat lagi.');
            }
        });

    };
})

.controller('LoginCtrl', function($scope, $http) {

    this.login = function() {
        if ($scope.email.$invalid || $scope.password.$invalid) {
            return;
        }

        window.plugins.spinnerDialog.show(null, "Logging in...");
        $http.post(API_URL + "login", {email: $scope.email, password: $scope.password})
        .then(function(res) {
            window.plugins.spinnerDialog.hide();

            if (res.data == "") {
                ons.notification.alert("Email & Password salah.");
            }

            else {
                if (res.data.active == 0) {
                    ons.notification.alert("Akun anda di suspend. Silakan hubungi contact center kami.");
                }

                else {
                    API_TOKEN = res.data.api_token;
                    window.localStorage.setItem("API_TOKEN", res.data.api_token);
                    navi.resetToPage('main.html');
                }
            }

        }, function(e) {
            window.plugins.spinnerDialog.hide();
            navigator.notification.alert("Koneksi ke server gagal! Silakan coba beberapa saat lagi.");
        });
    };
})

.controller('ReservationCtrl', function($scope, $http) {

    this.cancel = function() {
        ons.notification.confirm('Anda yakin akan membatalkan reservasi ini?', {
            title: 'BATALKAN RESERVASI',
            buttonLabels: ['TIDAK', 'YA'],
            callback: function(btn) {
                if (btn == 1) {
                    navi.popPage();
                    $http.post(API_URL + 'reservation/cancel', {id:$scope.reservation.id})
                    .then(function(res) {
                        ons.notification.alert('Reservasi anda telah dibatalkan.', {'title': 'BERHASIL'});
                    }, function(e) {
                        ons.notification.alert('Reservasi anda GAGAL dibatalkan.', {'title': 'GAGAL'});
                    });
                }
            }
        });
    };

})

.controller('DetailReservationCtrl', function($scope, $http) {
    $scope.reservation = $scope.navi.topPage.reservation;

    this.cancel = function() {
        ons.notification.confirm('Anda yakin akan membatalkan reservasi ini?', {
            title: 'BATALKAN RESERVASI',
            buttonLabels: ['TIDAK', 'YA'],
            callback: function(btn) {
                if (btn == 1) {
                    navi.popPage();
                    $http.post(API_URL + 'reservation/cancel', {id:$scope.reservation.id})
                    .then(function(res) {
                        ons.notification.alert('Reservasi anda telah dibatalkan.', {'title': 'BERHASIL'});
                    }, function(e) {
                        ons.notification.alert('Reservasi anda GAGAL dibatalkan.', {'title': 'GAGAL'});
                    });
                }
            }
        });
    };

})

.controller('LocationCtrl', function($scope, $http) {

})

.controller('DetailLocationCtrl', function($scope, $http) {
    $scope.location = $scope.navi.topPage.location;

})

.controller('NotificationCtrl', function($scope, $http) {

    this.delete = function(id) {
        ons.notification.confirm('Anda yakin akan menghapus notifikasi ini?', {
            title: 'HAPUS NOTIFIKASI',
            buttonLabels: ['TIDAK', 'YA'],
            callback: function(btn) {
                if (btn == 1) {
                    $http.delete(API_URL + 'notification/'+ id + '?api_token=' + API_TOKEN)
                    .then(function(res) {
                        ons.notification.alert('Notifikasi berhasil dihapus.', {title: 'BERHASIL'});
                    }, function(e) {
                        ons.notification.alert('Notifikasi gagal dihapus.', {title: 'GAGAL'});
                    });
                }
            }
        });
    };

})

.controller('DetailNotificationCtrl', function($scope, $http) {

    $scope.notification = $scope.navi.topPage.notification;

    this.delete = function() {
        ons.notification.confirm('Anda yakin akan menghapus notifikasi ini?', {
            title: 'HAPUS NOTIFIKASI',
            buttonLabels: ['TIDAK', 'YA'],
            callback: function(btn) {
                if (btn == 1) {
                    navi.popPage();
                    $http.post(API_URL + 'notification/'+ $scope.notification.id + '?api_token=' + API_TOKEN)
                    .then(function(res) {
                        ons.notification.alert('Notifikasi berhasil dihapus.', {title: 'BERHASIL'});
                    }, function(e) {
                        ons.notification.alert('Notifikasi gagal dihapus.', {title: 'GAGAL'});
                    });
                }
            }
        });
    };

})

.controller('NewReservationCtrl', function($scope, $http) {

    $scope.locations = $scope.navi.topPage.locations;

    this.submit = function() {
        window.plugins.spinnerDialog.show(null, "Saving...");

        $http.post(API_URL + "reservation", {
            location_id : $scope.location_id,
            api_token   : API_TOKEN,
            date        : $scope.date,
            lat         : $scope.lat,
            lng         : $scope.lng
        })

        .then(function(res) {
            window.plugins.spinnerDialog.hide();
            var reservasi = res.data;
            navi.pushPage('reservation_detail.html');
        }, function(e) {
            window.plugins.spinnerDialog.hide();
            if (e.status == 442) {
                $scope.errors = e.data;
                ons.notification.alert(JSON.stringify(e));
            } else {
                ons.notification.alert("Gagal melakukan reservasi. Silakan ulangi beberapa saat lagi");
            }
        });

    };
});
