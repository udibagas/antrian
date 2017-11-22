cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-spinner-dialog.SpinnerDialog",
    "file": "plugins/cordova-plugin-spinner-dialog/www/spinner.js",
    "pluginId": "cordova-plugin-spinner-dialog",
    "merges": [
      "window.plugins.spinnerDialog"
    ]
  },
  {
    "id": "cordova-plugin-device.device",
    "file": "plugins/cordova-plugin-device/www/device.js",
    "pluginId": "cordova-plugin-device",
    "clobbers": [
      "device"
    ]
  },
  {
    "id": "cordova-plugin-network-information.network",
    "file": "plugins/cordova-plugin-network-information/www/network.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "navigator.connection",
      "navigator.network.connection"
    ]
  },
  {
    "id": "cordova-plugin-network-information.Connection",
    "file": "plugins/cordova-plugin-network-information/www/Connection.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "Connection"
    ]
  },
  {
    "id": "cordova-plugin-dialogs.notification",
    "file": "plugins/cordova-plugin-dialogs/www/notification.js",
    "pluginId": "cordova-plugin-dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "cordova-plugin-dialogs.notification_android",
    "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
    "pluginId": "cordova-plugin-dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "cordova-plugin-advanced-geolocation.AdvancedGeolocation",
    "file": "plugins/cordova-plugin-advanced-geolocation/www/AdvancedGeolocation.js",
    "pluginId": "cordova-plugin-advanced-geolocation",
    "clobbers": [
      "AdvancedGeolocation"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-spinner-dialog": "1.3.1",
  "cordova-plugin-device": "1.1.7",
  "cordova-plugin-network-information": "1.3.4",
  "cordova-plugin-dialogs": "1.3.4",
  "cordova-plugin-advanced-geolocation": "1.1.0",
  "cordova-plugin-whitelist": "1.3.3"
};
// BOTTOM OF METADATA
});