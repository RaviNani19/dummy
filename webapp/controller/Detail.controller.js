sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"DummyFbdummy/model/formatter"
], function(Controller, JSONModel, MessageToast,formatter) {
	"use strict";
	return Controller.extend("DummyFbdummy.controller.Detail", {
		formatter: formatter,
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("page3").attachPatternMatched(this._onObjectMatched, this);
			this.oModel = new sap.ui.model.odata.ODataModel("/northwind/V2/(S(gwuvrltr4hrue0lqhn0ssddy))/OData/OData.svc", true);
			this.oDialog = sap.ui.xmlfragment("productId", "DummyFbdummy.Fragments.products", this);
			this.getView().addDependent(this.oDialog);
			this.oDialog1 = sap.ui.xmlfragment("supplierId", "DummyFbdummy.Fragments.suppliers", this);
			this.getView().addDependent(this.oDialog1);
			this.getProducts();
		},
		getProducts: function() {
			this.oModel.read("/Products", null, null, true);
			this.oModel.read("/Suppliers", null, null, true);
		},
		onProducts: function(oEvent) {
			this.addProductText = oEvent.getSource().getText();
			this.addSupplierText = oEvent.getSource().getText();
			if (this.addProductText === "Add Products") {
				this.oDialog.open();
				this.onSave();
			}
			if (this.addSupplierText === "Add Suppliers") {
				this.oDialog1.open();
				this.onSave();
			}
		},
		onSave: function() {
			if (this.addProductText === "Add Products") {
				var ID = sap.ui.getCore().byId("productId--id").getValue();
				var ReleaseDate = sap.ui.getCore().byId("productId--relDate").getValue();
				var DiscontinuedDate = sap.ui.getCore().byId("productId--disDate").getValue();
				var Price = sap.ui.getCore().byId("productId--price").getValue();
				var Rating = sap.ui.getCore().byId("productId--rating").getValue();
				var oEntry = {
					ID: ID,
					ReleaseDate: ReleaseDate,
					DiscontinuedDate: DiscontinuedDate,
					Price: Price,
					Rating: Rating
				};
				this.oModel.create("/Products", oEntry, null, this.addProductsSucc.bind(this));
			}
			if (this.addSupplierText === "Add Suppliers") {
				var ID = sap.ui.getCore().byId("supplierId--id").getValue();
				var Name = sap.ui.getCore().byId("supplierId--name").getValue();
				var Street = sap.ui.getCore().byId("supplierId--street").getValue();
				var Country = sap.ui.getCore().byId("supplierId--country").getValue();
				var ZipCode = sap.ui.getCore().byId("supplierId--zipcode").getValue();
				var oEntry = {
					ID: ID,
					Name: Name,
					Address: {
						Street: Street,
						Country: Country,
						ZipCode: ZipCode
					}
				};
				this.oModel.create("/Suppliers", oEntry, null, this.addSuppliersSucc.bind(this));
			}
		},
		addProductsSucc: function(oData) {
			this.oDialog.close();
			MessageToast.show("Product Details Added Successfully.");
		},
		addSuppliersSucc: function(oData) {
			this.oDialog1.close();
			MessageToast.show("Supplier Details Added Successfully.");
		},
		_onObjectMatched: function(oEvent) {
			var idx = oEvent.getParameter("arguments").invoicePath1;
			var idx1 = oEvent.getParameter("arguments").invoicePath;
			var _list = this;
			var Model = this.getView().getModel("invoice");
			Model.read("/Categories(" + idx1 + ")/Products(" + idx + ")/Supplier", {
				success: function(oData) {
					var oList = new sap.ui.model.json.JSONModel();
					oList.setData(oData);
					_list.getView().setModel(oList, "localModel2");
				},
				error: function(oError) {
					sap.m.MessageToast.show("no data from backend service");
				}
			});
			var _list1 = this;
			Model.read("/Categories(" + idx1 + ")/Products(" + idx + ")", {
				success: function(oData) {
					var oList1 = new sap.ui.model.json.JSONModel();
					oList1.setData(oData);
					_list1.getView().setModel(oList1, "localModel3");
				},
				error: function(oError) {
					sap.m.MessageToast.show("no data from backend service");
				}
			});
		},
		onCancel: function() {
			if (this.addProductText === "Add Products") {
				this.oDialog.close();
			}
			if (this.addSupplierText === "Add Suppliers") {
				this.oDialog1.close();
			}
		}
	});

});