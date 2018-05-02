"use strict";sap.ui.define(["sap/ui/core/Element","./library"],function(e,t){return e.extend("ui5.viz.ChartAxis",{metadata:{library:"ui5.viz",properties:{title:{type:"string",group:"Appereance",defaultValue:null},showTitle:{type:"boolean",group:"Appereance",defaultValue:!0},showGridLines:{type:"boolean",group:"Appereance",defaultValue:!1},minValue:{type:"string",group:"Appereance",defaultValue:null},maxValue:{type:"string",group:"Appereance",defaultValue:null},autoTickValues:{type:"boolean",group:"Appereance",defaultValue:!1},visible:{type:"boolean",group:"Appereance",defaultValue:!0},_axisType:{type:"ui5.viz.Axis",group:"Data",hidden:!0,defaultValue:t.Axis.X}},aggregations:{labels:{type:"ui5.viz.ChartAxisLabel",multiple:!0}},defaultAggregation:"labels",associations:{},events:{axisUpdate:{}}},constructor:function(){e.prototype.constructor.apply(this,arguments)},init:function(){},exit:function(){this.fireAxisUpdate()},insertAggregation:function(i,a,r,s){return"labels"===i&&this.getProperty("_axisType")===t.Axis.X?(e.prototype.insertAggregation.call(this,i,a,!0),a.attachAxisLabelUpdate(this.fireAxisUpdate.bind(this)),this.fireAxisUpdate()):e.prototype.insertAggregation.call(this,i,a,r,s),this},addAggregation:function(i,a,r){return"labels"===i&&this.getProperty("_axisType")===t.Axis.X?(e.prototype.addAggregation.call(this,i,a,!0),a.attachAxisLabelUpdate(this.fireAxisUpdate.bind(this)),this.fireAxisUpdate()):e.prototype.addAggregation.call(this,i,a,r),this},removeAggregation:function(i,a,r){return"labels"===i&&this.getProperty("_axisType")===t.Axis.X?(e.prototype.removeAggregation.call(this,i,a,!0),a.attachAxisLabelUpdate(this.fireAxisUpdate.bind(this)),this.fireAxisUpdate()):e.prototype.removeAggregation.call(this,i,a,r),this},removeAllAggregation:function(i,a){return"labels"===i&&this.getProperty("_axisType")===t.Axis.X?(e.prototype.removeAllAggregation.call(this,i,!0),this.fireAxisUpdate()):e.prototype.removeAllAggregation.call(this,i,a),this},destroyAggregation:function(i,a){return"labels"===i&&this.getProperty("_axisType")===t.Axis.X?(e.prototype.destroyAggregation.call(this,i,!0),this.fireAxisUpdate()):e.prototype.destroyAggregation.call(this,i,a),this},setProperty:function(t,i,a){return["title","showTitle","visible"].includes(t)?(e.prototype.setProperty.call(this,t,i,!0),this.fireAxisUpdate()):e.prototype.setProperty.call(this,t,i,a),this}})},!0);