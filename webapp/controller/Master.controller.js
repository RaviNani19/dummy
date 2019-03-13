sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"DummyFbdummy/model/formatter"
], function(Controller,formatter) {
	"use strict";
	return Controller.extend("DummyFbdummy.controller.Master", {
		formatter: formatter,
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("page2").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			this.idx = oEvent.getParameter("arguments").invoicePath;
			var _list = this;
			var Model = this.getView().getModel("invoice");
			Model.read("/Categories(" + this.idx + ")/Products", {
				success: function(oData) {
					_list.getView().byId("list");
					var oList = new sap.ui.model.json.JSONModel();
					oList.setData(oData);
					_list.getView().setModel(oList, "localModel1");
				},
				error: function(oError) {
					sap.m.MessageToast.show("no data from backend service");
				}
			});
		},
		onPressObject: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("page3", {
				invoicePath: this.idx,
				invoicePath1: oEvent.getSource().getBindingContext("localModel1").getObject().ProductID
			});
		},
		toInitial:function(){
			this.getOwnerComponent().getRouter().navTo("page1");
		}
	});

});