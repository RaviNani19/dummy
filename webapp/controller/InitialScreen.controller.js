sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(Controller, MessageBox, MessageToast) {
	"use strict";
	var oSelectedItem;
	return Controller.extend("DummyFbdummy.controller.InitialScreen", {
		onInit: function() {
			this.oModel = new sap.ui.model.odata.ODataModel("/northwind/V2/(S(gwuvrltr4hrue0lqhn0ssddy))/OData/OData.svc", true);
			this.oDialog = sap.ui.xmlfragment("categoryId", "DummyFbdummy.Fragments.dialog1", this);
			this.getView().addDependent(this.oDialog);
			this.getCategories();
		},
		getCategories: function() {
			this.oModel.read("/Categories", null, null, true);
		},
		onAddCategory: function(oEvent) {
			this.oDialog.open();
			this.onSave();
		},
		onSave: function() {
			var ID = sap.ui.getCore().byId("categoryId--id").getValue();
			var Name = sap.ui.getCore().byId("categoryId--name").getValue();
			var oEntry = {
				ID: ID,
				Name: Name
			};
			if (this.updCate === "Update") {
				this.oModel.update("/Categories(" + Number(ID) + ")", oEntry, null, this.addCategroriesSucc.bind(this), this.getCategoriesErr.bind(
					this));
			}
			if (this.updCate === "Delete") {
				this.oModel.remove("/Categories(" + ID + ")", oEntry, null, this.addCategroriesSucc.bind(this), this.getCategoriesErr.bind(
					this));
			}
			else {
				this.oModel.create("/Categories", oEntry, null, this.addCategroriesSucc.bind(this), this.getCategoriesErr.bind(this));
			}
		},
		addCategroriesSucc: function(oData) {
			this.oDialog.close();
			MessageToast.show("Entry Added Successfully.");
		},
		getCategoriesErr: function(oError) {
			MessageBox.error("Error .");
		},
		onCancel: function() {
			this.oDialog.close();
		},
		onUpdCat: function(oEvent) {
			this.updCate = oEvent.getSource().getText();
			this.oDialog.open();
		},
		onAfterRendering: function() {
			var _list = this;
			var Model = this.getView().getModel("invoice");
			Model.read("/Categories", {
				success: function(oData) {
					_list.getView().byId("categoryInput");
					var oList = new sap.ui.model.json.JSONModel();
					oList.setData(oData);
					_list.getView().setModel(oList, "localModel");
				},
				error: function(oError) {
					sap.m.MessageToast.show("no data from backend service");
				}
			});
		},
		onCategoryClick: function(oEvent) {
			var oDialog1 = sap.ui.xmlfragment("DummyFbdummy.Fragments.categorySearchHelp", this);
			this.getView().addDependent(oDialog1);
			oDialog1.open();
		},
		onNext: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("page2", {
				invoicePath: oSelectedItem.getBindingContext("localModel").getObject().CategoryID
			});
		},
		handleHelpConfirm: function(oEvent) {
			oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var title = this.getView().byId("categoryInput").setValue(oSelectedItem.getTitle());
			}
		}

	});
});