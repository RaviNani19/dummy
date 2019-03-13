sap.ui.define([], function() {
	"use strict";
	return {
		status: function(sKflag) {

			if (sKflag === "Available") {

				return "Success";
			} else if (sKflag === "Out of Stock") {

				return "Error";
			} else {

				return "Warning";
			}
		}
	};
});