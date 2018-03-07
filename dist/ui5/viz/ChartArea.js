"use strict";sap.ui.define(["sap/ui/core/Element","./library"],function(e,t){return e.extend("ui5.viz.ChartArea",{metadata:{library:"ui5.viz",properties:{title:{type:"string",group:"Appereance",defaultValue:null},style:{type:"ui5.viz.ShapeStyle",group:"Appearance",defaultValue:t.ShapeStyle.Solid},color:{type:"sap.ui.core.CSSColor",group:"Appearance",defaultValue:null},axis:{type:"ui5.viz.Axis",group:"Appearance",defaultValue:t.Axis.X},visible:{type:"boolean",group:"Appereance",defaultValue:!0},startValue:{type:"string",group:"Data",defaultValue:null},endValue:{type:"string",group:"Data",defaultValue:null}},aggregations:{},associations:{},events:{areaUpdate:{parameters:{code:{type:"ui5.viz.ChartUpdateCode"}}}}},init:function(){},constructor:function(){e.prototype.constructor.apply(this,arguments)},exit:function(){this.fireAreaUpdate({code:t.ChartUpdateCode.Area})},getStartValue:function(){var e=this.getProperty("startValue");return this.getProperty("axis")===t.Axis.X?this.getParent().getXAxisIndexByValue(e):e},getEndValue:function(){var e=this.getProperty("endValue");return this.getProperty("axis")===t.Axis.X?this.getParent().getXAxisIndexByValue(e):e},setProperty:function(a,r,i){return["style","color","axis","title","startValue","endValue","visible"].includes(a)?(e.prototype.setProperty.call(this,a,r,!0),this.fireAreaUpdate({code:t.ChartUpdateCode.Area})):e.prototype.setProperty.call(this,a,r,i),this}})},!0);