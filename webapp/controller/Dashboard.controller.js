sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.espedia.demo.KpiDashboard.controller.Dashboard", {

		/////////////////////////////////////////////
		// JSON MODELS

		equiModel: {
			"Equipment": "",
			"Descript": "",
			"EquiDescr": ""
		},

		// END JSON MODELS
		/////////////////////////////////////////////

		onInit: function () {
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "kpiModel");
			this.initKpi();
		},

		initKpi: function () {
			if (this._equiModel === undefined) {
				this.mutableJSON = JSON.parse(JSON.stringify(this.equiModel));
				this._equiModel = new sap.ui.model.json.JSONModel(this.mutableJSONNotif);
			}
			this._equiModel.setProperty("/EquiDescr", "ALL Equipments");
			this.byId("pageHeader").setModel(this._equiModel);
			this._getKpi("/KpiSet");
		},

		_getKpi: function (sPath) {

			this.PredVsReactOrd = this.byId("PredVsReactOrd");
			this.DelayNotif = this.byId("DelayNotif");
			this.DayNotifOrderAvg = this.byId("DayNotifOrderAvg");
			this.DelayOrder = this.byId("DelayOrder");
			this.RelVsUnrelOrder = this.byId("RelVsUnrelOrder");
			//this.NotifWoCauseOrDamage = this.byId("NotifWoCauseOrDamage");
			this.OrderCompletedInTime = this.byId("OrderCompletedInTime");

			this._setBusy(true);

			var oViewModel = this.getOwnerComponent().getModel();
			oViewModel.read(sPath, {
				success: function (oData) {
					var results;
					if (oData.results === undefined) {
						results = oData;
					} else {
						results = oData.results[0];
					}
					this.getView().getModel("kpiModel").oData = results;

					this.PredVsReactOrd.setValue('55.91'); //(results.PercPredVsReactOrd);
					this.PredVsReactOrd.setScale('%');
					this._setValueColor(this.PredVsReactOrd);
					this.DelayNotif.setValue(parseInt(results.NoDelayNotif, 10));
					this.DelayNotif.setBusy(false);
					this.DayNotifOrderAvg.setValue(results.DayNotifOrderAvg);
					this.DayNotifOrderAvg.setScale('Day');
					this._setValueColor(this.DayNotifOrderAvg);
					this.DelayOrder.setValue(results.PercDelayOrder);
					this.DelayOrder.setScale('%');
					this._setValueColor(this.DelayOrder);
					this.RelVsUnrelOrder.setValue(results.PercRelVsUnrelOrder);
					this.RelVsUnrelOrder.setScale('%');
					this._setValueColor(this.RelVsUnrelOrder);
					//this.NotifWoCauseOrDamage.setValue(results.PercNotifWoCauseOrDamage);
					//this.NotifWoCauseOrDamage.setScale('%');
					this.OrderCompletedInTime.setValue(results.PercOrderCompletedInTime);
					this.OrderCompletedInTime.setScale('%');
					this._setValueColor(this.OrderCompletedInTime);
					this._setBusy(false);
				}.bind(this),
				error: function (err) {
					sap.m.MessageToast.show("OData Error");
					this._setBusy(false);
				}.bind(this)
			});
		},

		_setValueColor: function (obj) {
			var value = obj.getValue();
			var color;
			if (value <= 40) {
				color = "Good";
			} else if (value > 40 && value <= 80) {
				color = "Critical";
			} else if (value > 80) {
				color = "Error";
			}
			obj.setValueColor(color);
		},

		_setBusy: function (bool) {
			this.PredVsReactOrd.setBusy(bool);
			this.DelayNotif.setBusy(bool);
			this.DayNotifOrderAvg.setBusy(bool);
			this.DelayOrder.setBusy(bool);
			this.RelVsUnrelOrder.setBusy(bool);
			//this.NotifWoCauseOrDamage.setBusy(bool);
			this.OrderCompletedInTime.setBusy(bool);
		},

		handleClearEquipment: function (oEvent) {
			this.initKpi();
		},

		handleEquipmentF4: function (oEvent) {
			//	var sInputValue = oEvent.getSource().getValue();
			if (!this._equiSearchDialog) {
				this._equiSearchDialog = sap.ui.xmlfragment(
					"com.espedia.demo.KpiDashboard.view.fragments.EquipmentSearchDialog",
					this
				);
				this.getView().addDependent(this._equiSearchDialog);
			}
			this.equiClearForm();
			this.equiDialogSearch();
			this._equiSearchDialog.open();
		},

		equiDialogSearch: function () {
			var equnr = sap.ui.getCore().byId("eqSearchNum").getValue();
			var descr = sap.ui.getCore().byId("eqSearchDescr").getValue();
			var plant = sap.ui.getCore().byId("eqSearchPlant").getValue();
			var funcloc = sap.ui.getCore().byId("eqSearchFuncloc").getValue();
			//var langu = sap.ui.getCore().byId("eqSearchLangu").getValue();
			var aFilters = [
				new sap.ui.model.Filter("Equnr", sap.ui.model.FilterOperator.Contains, equnr),
				new sap.ui.model.Filter("Eqktx", sap.ui.model.FilterOperator.Contains, descr),
				new sap.ui.model.Filter("Swerk", sap.ui.model.FilterOperator.Contains, plant),
				new sap.ui.model.Filter("Tplnr", sap.ui.model.FilterOperator.Contains, funcloc)
			];
			sap.ui.getCore().byId("equiDialogList").getBinding("items").filter(aFilters);
		},

		equiDialogSelect: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext().getPath();
			var rowData = this.getView().getModel().getProperty(sPath);
			var EquiDescr = rowData.Eqktx + ": " + rowData.Equnr;
			this._equiModel.setProperty("/EquiDescr", EquiDescr);
			var sKpiPath = "/KpiSet('" + rowData.Equnr + "')";
			this._getKpi(sKpiPath);
			this.eqSearchDialogClose();
		},

		equiClearForm: function () {
			sap.ui.getCore().byId("eqSearchNum").setValue("");
			sap.ui.getCore().byId("eqSearchDescr").setValue("");
			sap.ui.getCore().byId("eqSearchPlant").setValue("");
			sap.ui.getCore().byId("eqSearchFuncloc").setValue("");
		},

		eqSearchDialogClose: function () {
			this._equiSearchDialog.close();
			this.equiClearForm();
		}

	});
});