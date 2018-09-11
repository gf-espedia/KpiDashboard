sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.espedia.demo.KpiDashboard.controller.Dashboard", {

		onInit: function () {

			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "kpiModel");
			this._getKpi();

			this.PredVsReactOrd = this.byId("PredVsReactOrd");
			this.DelayNotif = this.byId("DelayNotif");
			this.DayNotifOrderAvg = this.byId("DayNotifOrderAvg");
			this.DelayOrder = this.byId("DelayOrder");
			this.RelVsUnrelOrder = this.byId("RelVsUnrelOrder");
			//this.NotifWoCauseOrDamage = this.byId("NotifWoCauseOrDamage");
			this.OrderCompletedInTime = this.byId("OrderCompletedInTime");

			this.PredVsReactOrd.setBusy(true);
			this.DelayNotif.setBusy(true);
			this.DayNotifOrderAvg.setBusy(true);
			this.DelayOrder.setBusy(true);
			this.RelVsUnrelOrder.setBusy(true);
			//this.NotifWoCauseOrDamage.setBusy(true);
			this.OrderCompletedInTime.setBusy(true);

		},

		_getKpi: function () {
			var oViewModel = this.getOwnerComponent().getModel();
			oViewModel.read("/KpiSet", {
				success: function (oData) {
					var results = oData.results[0];
					this.getView().getModel("kpiModel").oData = results;

					this.PredVsReactOrd.setValue('55.91'); //(results.PercPredVsReactOrd);
					this.PredVsReactOrd.setScale('%');
					this._setValueColor(this.PredVsReactOrd);
					this.PredVsReactOrd.setBusy(false);
					this.DelayNotif.setValue(parseInt(results.NoDelayNotif, 10));
					this.DelayNotif.setBusy(false);
					this.DayNotifOrderAvg.setValue(results.DayNotifOrderAvg);
					this.DayNotifOrderAvg.setScale('Day');
					this._setValueColor(this.DayNotifOrderAvg);
					this.DayNotifOrderAvg.setBusy(false);
					this.DelayOrder.setValue(results.PercDelayOrder);
					this.DelayOrder.setScale('%');
					this._setValueColor(this.DelayOrder);
					this.DelayOrder.setBusy(false);
					this.RelVsUnrelOrder.setValue(results.PercRelVsUnrelOrder);
					this.RelVsUnrelOrder.setScale('%');
					this._setValueColor(this.RelVsUnrelOrder);
					this.RelVsUnrelOrder.setBusy(false);
					//this.NotifWoCauseOrDamage.setValue(results.PercNotifWoCauseOrDamage);
					//this.NotifWoCauseOrDamage.setScale('%');
					//this.NotifWoCauseOrDamage.setBusy(false);
					this.OrderCompletedInTime.setValue(results.PercOrderCompletedInTime);
					this.OrderCompletedInTime.setScale('%');
					this._setValueColor(this.OrderCompletedInTime);
					this.OrderCompletedInTime.setBusy(false);

				}.bind(this),
				error: function (err) {
					sap.m.MessageToast.show("OData Error");
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
		}

	});
});