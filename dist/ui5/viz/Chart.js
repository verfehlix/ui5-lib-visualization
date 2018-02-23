"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,i=Array(e.length);t<e.length;t++)i[t]=e[t];return i}return Array.from(e)}sap.ui.define(["sap/ui/core/Control","sap/ui/core/format/DateFormat","./ChartAxis","./ChartAxisLabel","./library","sap/ui/thirdparty/d3","../libs/c3","../libs/lodash"],function(e,t,i,a,r){return e.extend("ui5.viz.Chart",{metadata:{library:"ui5.viz",properties:{dataVisible:{type:"boolean",group:"Appearance",defaultValue:!0},width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"360px"},showSubchart:{type:"boolean",group:"Appearance",defaultValue:!1},microMode:{type:"boolean",group:"Appearance",defaultValue:!1},zoomEnabled:{type:"boolean",group:"Appearance",defaultValue:!1},clipZoomOverflow:{type:"boolean",group:"Appearance",defaultValue:!0},showDataPoints:{type:"boolean",group:"Appearance",defaultValue:!0},backgroundColor:{type:"sap.ui.core.CSSColor",group:"Appearance",defaultValue:"transparent"},legendPosition:{type:"ui5.viz.ChartLegendPosition",group:"Appearance",defaultValue:r.ChartLegendPosition.Right},showLegend:{type:"boolean",group:"Appearance",defaultValue:!1},showTooltip:{type:"boolean",group:"Appearance",defaultValue:!1},groupedTooltip:{type:"boolean",group:"Appearance",defaultValue:!1},switchAxisPosition:{type:"boolean",group:"Appearance",defaultValue:!1},xAxisType:{type:"ui5.viz.AxisType",group:"Data",defaultValue:r.AxisType.Category}},aggregations:{xAxis:{type:"ui5.viz.ChartAxis",multiple:!1},yAxis:{type:"ui5.viz.ChartAxis",multiple:!1},y2Axis:{type:"ui5.viz.ChartAxis",multiple:!1},colors:{type:"ui5.viz.Color",multiple:!0},lines:{type:"ui5.viz.ChartLine",multiple:!0},areas:{type:"ui5.viz.ChartArea",multiple:!0},series:{type:"ui5.viz.ChartSeries",multiple:!0}},defaultAggregation:"series",associations:{},events:{chartDataUpdate:{parameters:{}}}},_chart:null,_haltCount:0,_initChartUpdateHandler:function(){this._haltCount=0},_getChartUpdateHandler:function(){var e=this;return{halt:function(){++e._haltCount,0!==e._haltCount&&e.setBusy(!0)},release:function(){--e._haltCount,0===e._haltCount&&e.setBusy(!1)},isHalted:function(){return 0!==e._haltCount}}},_seriesNumberCount:0,_initNumberRangeCreator:function(){this._seriesNumberCount=0},_getNumberRangeCreator:function(){var e=this;return{getNext:function(){return e._seriesNumberCount++}}},_debounceUpdate:null,_debounceUpdateChartLines:null,_debounceUpdateChartAreas:null,CSS_CLASS:"ui5-viz-chart",CSS_CLASS_NOCLIP:"ui5-viz-chart-noclippath",CSS_HIGHLIGHT_PULSATE:"ui5-viz-chart-point-highlight-pulsate",CSS_CLASS_LINE:"ui5-viz-chart-line",CSS_CLASS_LINE_SHOWSELECTOR:"ui5-viz-chart-line-selector-visible",CSS_CLASS_LINE_ICONONLY:"ui5-viz-chart-line-selector-icononly",CSS_CLASS_AREA:"ui5-viz-chart-area",CSS_CLASS_NO_POINTS:"ui5-viz-chart-hide-data-points",CSS_CLASS_MICRO_MODE:"ui5-viz-chart-micro-mode",constructor:function(){e.prototype.constructor.apply(this,arguments),this._getChartUpdateHandler().release()},init:function(){this._initNumberRangeCreator(),this._initChartUpdateHandler(),this._chart=null,this._getChartUpdateHandler().halt(),this._debounceUpdate=_.debounce(this._onDataUpdate,10),this._debounceUpdateChartLines=_.debounce(this._updateChartLines,50),this._debounceUpdateChartAreas=_.debounce(this._updateChartAreas,50)},onBeforeRendering:function(){this._getChartUpdateHandler().halt(),this._chart&&this._chart.destroy()},renderer:function(e,t){e.write("<div"),e.writeControlData(t),e.addClass(t.CSS_CLASS),e.writeClasses(),e.write(">"),e.write("</div>")},onAfterRendering:function(){var e=this,i=this.getXAxis(),a=this.getYAxis(),n=this.getY2Axis(),s=this.getSeries(),o=[];if(this.getMicroMode()){i.setProperty("visible",!1,!0),a.setProperty("visible",!1,!0),n.setProperty("visible",!1,!0)}var l={bindto:"#"+this.getId(),size:{width:this.getWidth(),height:this.getHeigth()-(i.getShowTitle()&&i.getVisible()&&i.getTitle()?15:0)},padding:{top:this.getMicroMode()?0:void 0,bottom:i.getShowTitle()&&i.getVisible()&&i.getTitle()?15:void 0,left:this.getMicroMode()?0:void 0,right:this.getMicroMode()?0:void 0},subchart:{show:this.getShowSubchart()},zoom:{enabled:this.getZoomEnabled()},legend:{position:this.getLegendPosition(),show:this.getShowLegend()},tooltip:{show:this.getShowTooltip(),grouped:this.getGroupedTooltip(),format:{value:function(e,t,i,a){var r=s.find(function(e){return e.getKey()===i}),n=r?r.getData()[a]:null,o=n?n.getLabel():e;return o||e},title:function(){switch(e.getXAxisType()){case r.AxisType.Time:return function(e){return t.getInstance({style:"long"}).format(e)};case r.AxisType.Indexed:case r.AxisType.Category:default:return function(t){var i=e.getXAxisLabelByIndex(t),a=""===i.getTitle()?i.getValue():i.getTitle();return i&&i.getVisible()?a:void 0}}}()}},data:{x:"x",columns:[["x"].concat(_toConsumableArray(i.getLabels().map(function(t,i){switch(e.getXAxisType()){case r.AxisType.Time:return t.getValue();case r.AxisType.Indexed:return parseInt(t.getValue(),10)||i;case r.AxisType.Category:default:return t.getValue()}})))].concat(_toConsumableArray(s.map(function(e){var t=e.getData().map(function(t,i){return t.getVisible()&&t.getHighlightAnimation()!==r.DataPointAnimation.None&&o.push({series:e.getKey(),point:i,animation:t.getHighlightAnimation()}),t.getValueOrValuePair()})||[];return t.unshift(e.getKey()),t}))),axes:0===s.length?[]:s.reduce(function(e,t){return e[t.getKey()]=t.getYAxis(),e},{}),types:0===s.length?[]:s.reduce(function(e,t){return e[t.getKey()]=t.getType(),e},{}),names:0===s.length?[]:s.reduce(function(e,t){return e[t.getKey()]=t.getName()||t.getKey(),e},{}),colors:0===s.length?[]:s.reduce(function(e,t){return t.getColor()&&(e[t.getKey()]=t.getColor()),e},{}),labels:{format:0===s.length?[]:s.reduce(function(e,t){return e[t.getKey()]=function(e,i,a){var r=t.getData()[a]?t.getData()[a].getLabel():null,n=r||e;return t.getShowLabels()?n:null},e},{})},groups:0===s.length?[]:s.reduce(function(e,t){return t&&t.getGroupKey()&&!e.includes(t.getGroupKey())&&e.push(t.getGroupKey()),e},[]).map(function(e){return s.filter(function(t){return t.getGroupKey()===e}).map(function(e){return e.getKey()})})},color:{pattern:this.getColors().map(function(e){return e.getColor()}).concat(r.ColorPalette.custom?r.ColorPalette.custom:r.ColorPalette.Material300)},axis:{rotated:this.getSwitchAxisPosition(),x:{show:i.getVisible(),type:function(){switch(e.getXAxisType()){case r.AxisType.Time:return"timeseries";case r.AxisType.Indexed:return"indexed";case r.AxisType.Category:default:return"category"}}(),categories:this.getXAxisType()===r.AxisType.Category?i.getLabels().map(function(e){return e.getValue()}):void 0,max:this.getMaxValueByAxis(i),min:this.getMinValueByAxis(i),tick:{centered:!1,values:i.getLabels().length>0?i.getLabels().map(function(t,i){switch(e.getXAxisType()){case r.AxisType.Time:return t.getValue();case r.AxisType.Indexed:return parseInt(t.getValue(),10)||0;case r.AxisType.Category:default:return i}}):null,format:function(){switch(e.getXAxisType()){case r.AxisType.Time:return function(e){return t.getInstance({pattern:"MMM yyyy"}).format(e)};case r.AxisType.Indexed:case r.AxisType.Category:default:return function(t){var i=e.getXAxisLabelByIndex(t),a=""===i.getTitle()?i.getValue():i.getTitle();return i&&i.getVisible()?a:void 0}}}()},label:{text:i.getShowTitle()?i.getTitle():null,position:"outer-center"}},y:{show:a.getVisible(),max:this.getMaxValueByAxis(a)||a.getLabels().reduce(function(e,t){return Math.max(void 0===e?-1/0:e,parseInt(t.getValue(),10)||void 0)},void 0),min:this.getMinValueByAxis(a)||a.getLabels().reduce(function(e,t){return Math.min(void 0===e?1/0:e,parseInt(t.getValue(),10)||void 0)},void 0),padding:{top:this.getMicroMode()?void 0:0,bottom:this.getMicroMode()?void 0:0},default:[a.getMinValue()||a.getLabels().reduce(function(e,t){return Math.min(void 0===e?1/0:e,parseInt(t.getValue(),10)||void 0)},void 0),a.getMaxValue()||a.getLabels().reduce(function(e,t){return Math.max(void 0===e?-1/0:e,parseInt(t.getValue(),10)||void 0)},void 0)],tick:{values:a.getLabels().length>0?a.getLabels().map(function(e){return parseInt(e.getValue(),10)||0}):null,format:function(e){var t=a.getLabels().find(function(t){return parseInt(t.getValue(),10)===e});if(!t)return e;var i=""===t.getTitle()?t.getValue():t.getTitle();return t.getVisible()?i:void 0}},label:{text:a.getShowTitle()?a.getTitle():null,position:"outer-middle"}},y2:{show:n.getVisible(),max:this.getMaxValueByAxis(n),min:this.getMinValueByAxis(n),padding:{top:0,bottom:0},default:[n.getMinValue()||n.getLabels().reduce(function(e,t){return Math.min(void 0===e?1/0:e,parseInt(t.getValue(),10)||void 0)},void 0),n.getMaxValue()||n.getLabels().reduce(function(e,t){return Math.max(void 0===e?-1/0:e,parseInt(t.getValue(),10)||void 0)},void 0)],tick:{values:n.getLabels().length>0?n.getLabels().map(function(e){return parseInt(e.getValue(),10)||null}):null,format:function(e){var t=n.getLabels().find(function(t){return parseInt(t.getValue(),10)===e});if(!t)return e;var i=""===t.getTitle()?t.getValue():t.getTitle();return t.getVisible()?i:void 0}},label:{text:n.getShowTitle()?n.getTitle():null,position:"outer-middle"}}},grid:{x:{show:i.getShowGridLines(),lines:this.getLines().filter(function(e){return e.getVisible()&&e.getAxis()===r.Axis.X}).map(function(t){return e._mapChartLineToC3Line(t)})},y:{show:a.getShowGridLines(),lines:this.getLines().filter(function(e){return e.getVisible()&&e.getAxis()!==r.Axis.X}).map(function(t){return e._mapChartLineToC3Line(t)})}},regions:this.getAreas().filter(function(e){return e.getVisible()}).map(function(t){return{id:t.getId(),start:t.getStartValue(),end:t.getEndValue(),axis:t.getAxis(),text:t.getTitle(),class:e.CSS_CLASS_AREA+" "+e.CSS_CLASS_AREA+"-"+t.getId()}}),transition:{duration:175}};console.log(l),this._chart=c3.generate(l),d3.selectAll("#"+this.getId()+" g.c3-circles circle.c3-circle").classed(this.CSS_HIGHLIGHT_PULSATE,!1),o.length>0&&o.forEach(function(t){d3.select("#"+e.getId()+" g.c3-circles-"+t.series+" circle.c3-circle-"+t.point).classed(e.CSS_HIGHLIGHT_PULSATE,!0)}),this._updateSeriesStyles(),this._updateLineStyles(),this._updateAreaStyles(),this.getClipZoomOverflow()?this.removeStyleClass(this.CSS_CLASS_NOCLIP):this.addStyleClass(this.CSS_CLASS_NOCLIP),this.getDomRef()&&$(this.getDomRef()).css("background-color",this.getBackgroundColor()),$(window).resize(this._resize.bind(this)),setTimeout(function(){e._resize()},150),setTimeout(function(){e._resize()},1500),this._getChartUpdateHandler().release()},exit:function(){},setDataVisible:function(e){return this._chart&&(e?this._chart.show():this._chart.hide()),this.setProperty("dataVisible",e,!0)},setWidth:function(e){return this.setProperty("width",e,!0),this._chart&&this._chart.resize({width:this.getWidth()}),this},setHeight:function(e){return this.setProperty("height",e,!0),this._chart&&this._chart.resize({height:this.getHeigth()}),this},getWidth:function(){return this._getComputedSize(this.getProperty("width"),"width")},getHeigth:function(){return this._getComputedSize(this.getProperty("height"),"height")},setShowSubchart:function(e){return this.setProperty("showSubchart",e,!1)},setMicroMode:function(e){return e?this.addStyleClass(this.CSS_CLASS_MICRO_MODE):this.removeStyleClass(this.CSS_CLASS_MICRO_MODE),this.setProperty("microMode",e,!1)},setZoomEnabled:function(e){return this._chart&&this._chart.zoom.enable(e),this.setProperty("zoomEnabled",e,!0)},setClipZoomOverflow:function(e){return e?this.removeStyleClass(this.CSS_CLASS_NOCLIP):this.addStyleClass(this.CSS_CLASS_NOCLIP),this.setProperty("clipZoomOverflow",e,!0)},setShowDataPoints:function(e){return e?this.removeStyleClass(this.CSS_CLASS_NO_POINTS):this.addStyleClass(this.CSS_CLASS_NO_POINTS),this.setProperty("showDataPoints",e,!0)},setBackgroundColor:function(e){return this.getDomRef()&&$(this.getDomRef()).css("background-color",e),this.setProperty("backgroundColor",e,!0)},setLegendPosition:function(e){return this.setProperty("legendPosition",e,!1)},setShowLegend:function(e){return this._chart&&(e?this._chart.legend.show():this._chart.legend.hide()),this.setProperty("showLegend",e,!0)},setShowTooltip:function(e){return this.setProperty("showTooltip",e,!1)},setGroupedTooltip:function(e){return this.setProperty("groupedTooltip",e,!1)},setSwitchAxisPosition:function(e){return this.setProperty("switchAxisPosition",e,!1)},setXAxisType:function(e){return this.setProperty("xAxisType",e,!1)},getXAxis:function(){var e=void 0;return(e=this.getAggregation("xAxis"))||(e=new i,this.setAggregation("xAxis",e,!0)),e},getYAxis:function(){var e=void 0;return(e=this.getAggregation("yAxis"))||(e=new i,this.setAggregation("yAxis",e,!0)),e},getY2Axis:function(){var e=void 0;return(e=this.getAggregation("y2Axis"))||(e=new i({visible:!1}),this.setAggregation("y2Axis",e,!0)),e},setAggregation:function(t,i,a){var n=this;if(i)switch(t){case"xAxis":i.setProperty("_axisType",r.Axis.X,!0);break;case"yAxis":i.setProperty("_axisType",r.Axis.Y,!0);break;case"y2Axis":i.setProperty("_axisType",r.Axis.Y2,!0)}return["xAxis","yAxis","y2Axis"].includes(t)?(e.prototype.setAggregation.call(this,t,i,!1),i&&i.attachAxisUpdate(function(e){return n._onDataUpdateByCode(e.getParameter("code"))})):e.prototype.setAggregation.call(this,t,i,a),this},insertAggregation:function(t,i,a,n){var s=this;if("series"!==t||i.getKey()||i.setKey(this._getNumberRangeCreator().getNext()),["lines","areas"].includes(t))switch(e.prototype.insertAggregation.call(this,t,i,a,!0),t){case"lines":i.attachLineUpdate(function(e){return s._onDataUpdateByCode(e.getParameter("code"))}),this._onDataUpdateByCode(r.ChartUpdateCode.Line);break;case"areas":i.attachAreaUpdate(function(e){return s._onDataUpdateByCode(e.getParameter("code"))}),this._onDataUpdateByCode(r.ChartUpdateCode.Area)}else e.prototype.insertAggregation.call(this,t,i,a,n);return this},addAggregation:function(t,i,a){var n=this;if("series"!==t||i.getKey()||i.setKey(this._getNumberRangeCreator().getNext()),["lines","areas"].includes(t))switch(e.prototype.addAggregation.call(this,t,i,!0),t){case"lines":i.attachLineUpdate(function(e){return n._onDataUpdateByCode(e.getParameter("code"))}),this._onDataUpdateByCode(r.ChartUpdateCode.Line);break;case"areas":i.attachAreaUpdate(function(e){return n._onDataUpdateByCode(e.getParameter("code"))}),this._onDataUpdateByCode(r.ChartUpdateCode.Area)}else e.prototype.addAggregation.call(this,t,i,a);return this},removeAggregation:function(t,i,a){if(["series","lines","areas"].includes(t))switch(e.prototype.removeAggregation.call(this,t,i,!0),t){case"series":this._onDataUpdateByCode(r.ChartUpdateCode.DataPoint);break;case"lines":this._onDataUpdateByCode(r.ChartUpdateCode.Line);break;case"areas":this._onDataUpdateByCode(r.ChartUpdateCode.Area)}else e.prototype.removeAggregation.call(this,t,i,a);return this},removeAllAggregation:function(t,i){if(["series","lines","areas"].includes(t))switch(e.prototype.removeAllAggregation.call(this,t,!0),t){case"series":this._onDataUpdateByCode(r.ChartUpdateCode.DataPoint);break;case"lines":this._onDataUpdateByCode(r.ChartUpdateCode.Line);break;case"areas":this._onDataUpdateByCode(r.ChartUpdateCode.Area)}else e.prototype.removeAllAggregation.call(this,t,i);return this},destroyAggregation:function(t,i){if(["series","lines","areas"].includes(t))switch(e.prototype.destroyAggregation.call(this,t,!0),t){case"series":this._onDataUpdateByCode(r.ChartUpdateCode.DataPoint);break;case"lines":this._onDataUpdateByCode(r.ChartUpdateCode.Line);break;case"areas":this._onDataUpdateByCode(r.ChartUpdateCode.Area)}else e.prototype.destroyAggregation.call(this,t,i);return this},setModel:function(t,i){return this._getChartUpdateHandler().halt(),e.prototype.setModel.apply(this,arguments),this._getChartUpdateHandler().release(),this._onDataUpdateByCode(),this},getXAxisLabelByIndex:function(e){var t=this.getXAxis(),i=this.getXAxisType(),n=t.getLabels();return(i===r.AxisType.Indexed?n.find(function(t){return parseInt(t.getValue(),10)===e}):n[e])||new a({visible:!1})},getMinValueByAxis:function(e){this.getXAxisType();var t=e.getProperty("_axisType")===r.Axis.X,i=e.getMinValue()||void 0;if(t)switch(this.getXAxisType()){case r.AxisType.Time:return i;case r.AxisType.Indexed:case r.AxisType.Category:default:return parseInt(i,10)||void 0}return parseInt(i,10)||void 0},getMaxValueByAxis:function(e){this.getXAxisType();var t=e.getProperty("_axisType")===r.Axis.X,i=e.getMaxValue()||void 0;if(t)switch(this.getXAxisType()){case r.AxisType.Time:return i;case r.AxisType.Indexed:case r.AxisType.Category:default:return parseInt(i,10)||void 0}return parseInt(i,10)||void 0},_onDataUpdateByCode:function(e){if(!this._getChartUpdateHandler().isHalted())if(this._chart)switch(e){case r.ChartUpdateCode.Line:this._debounceUpdateChartLines(),this.fireChartDataUpdate();break;case r.ChartUpdateCode.Area:this._debounceUpdateChartAreas(),this.fireChartDataUpdate();break;default:this._debounceUpdate(),this.fireChartDataUpdate()}else this.rerender()},_onDataUpdate:function(){var t=this,i=this.getSeries(),a=i.map(function(e){return e.getKey()}),n=a.filter(function(e){return!1===t._chart.data().map(function(e){return e.id}).every(function(t){return t===e})}),s=this._chart.data().map(function(e){return e.id}).filter(function(e){return!1===a.some(function(t){return t===e})}),o=[],l=this.getXAxis(),u=this.getYAxis(),g=this.getY2Axis();n.length>0||s.length>0?this.rerender():(e.prototype.setProperty.call(l,"visible",!this.getMicroMode(),!0),e.prototype.setProperty.call(u,"visible",!this.getMicroMode(),!0),e.prototype.setProperty.call(g,"visible",!this.getMicroMode(),!0),this._chart.unload(s),this._chart.load({x:"x",columns:[["x"].concat(_toConsumableArray(l.getLabels().map(function(e){return e.getValue()})))].concat(_toConsumableArray(i.map(function(e){return[e.getKey()].concat(_toConsumableArray(e.getData().map(function(t,i){return t.getVisible()&&t.getHighlightAnimation()!==r.DataPointAnimation.None&&o.push({series:e.getKey(),point:i,animation:t.getHighlightAnimation()}),t.getValueOrValuePair()})))}))),axes:0===i.length?[]:i.reduce(function(e,t){return e[t.getKey()]=t.getYAxis(),e},{}),types:0===i.length?[]:i.reduce(function(e,t){return e[t.getKey()]=t.getType(),e},{}),names:0===i.length?[]:i.reduce(function(e,t){return e[t.getKey()]=t.getName()||t.getKey(),e},{}),colors:0===i.length?[]:i.reduce(function(e,t){return t.getColor()&&(e[t.getKey()]=t.getColor()),e},{})}),d3.selectAll("#"+this.getId()+" g.c3-circles circle.c3-circle").classed(this.CSS_HIGHLIGHT_PULSATE,!1),o.length>0&&o.forEach(function(e){d3.select("#"+t.getId()+" g.c3-circles-"+e.series+" circle.c3-circle-"+e.point).classed(t.CSS_HIGHLIGHT_PULSATE,!0)}),this._chart.groups(0===i.length?[]:i.reduce(function(e,t){return t&&t.getGroupKey()&&!e.includes(t.getGroupKey())&&e.push(t.getGroupKey()),e},[]).map(function(e){return i.filter(function(t){return t.getGroupKey()===e}).map(function(e){return e.getKey()})})),this._updateSeriesStyles(),this._chart.axis.labels({x:l.getShowTitle()?l.getTitle():null,y:u.getShowTitle()?u.getTitle():null,y2:g.getShowTitle()?g.getTitle():null}),this._chart.axis.showX(l.getVisible()),this._chart.axis.showY(u.getVisible()),this._chart.axis.showY2(g.getVisible()),this._chart.axis.range({min:{X:this.getMinValueByAxis(l),y:this.getMinValueByAxis(u)||u.getLabels().reduce(function(e,t){return Math.min(void 0===e?1/0:e,parseInt(t.getValue(),10)||void 0)},void 0),y2:this.getMinValueByAxis(g)},max:{x:this.getMaxValueByAxis(l),y:this.getMaxValueByAxis(u)||u.getLabels().reduce(function(e,t){return Math.max(void 0===e?-1/0:e,parseInt(t.getValue(),10)||void 0)},void 0),y2:this.getMaxValueByAxis(g)}}),this.fireChartDataUpdate())},_updateChartLines:function(){var e=this,t=[].concat(this._chart.xgrids()),i=[].concat(this._chart.ygrids()),a=this.getLines().filter(function(e){return e.getVisible()&&e.getAxis()===r.Axis.X}).map(function(t){return e._mapChartLineToC3Line(t)}),n=this.getLines().filter(function(e){return e.getVisible()&&e.getAxis()!==r.Axis.X}).map(function(t){return e._mapChartLineToC3Line(t)});if(a.filter(function(e){var i=t.find(function(t){return t.id===e.id});return i&&!1===_.isEqual(e,i)}).length>0)this._chart.xgrids(a);else{t.filter(function(e){return a.every(function(t){return t.id!==e.id})}).forEach(function(t){e._chart.xgrids.remove({class:t.class})});var s=a.filter(function(e){return t.every(function(t){return t.id!==e.id})});s.length>0&&this._chart.xgrids.add(s)}if(n.filter(function(e){var t=i.find(function(t){return t.id===e.id});return t&&!1===_.isEqual(e,t)}).length>0)this._chart.ygrids(n);else{i.filter(function(e){return n.every(function(t){return t.id!==e.id})}).forEach(function(t){e._chart.ygrids.remove({class:t.class})});var o=n.filter(function(e){return i.every(function(t){return t.id!==e.id})});o.length>0&&this._chart.ygrids.add(o)}this._updateLineStyles()},_updateChartAreas:function(){var e=this,t=this._chart.regions()||[],i=Array.isArray(t)?t:[t],a=this.getAreas().filter(function(e){return e.getVisible()}).map(function(t){return{id:t.getId(),start:t.getStartValue(),end:t.getEndValue(),axis:t.getAxis(),text:t.getTitle(),class:e.CSS_CLASS_AREA+" "+e.CSS_CLASS_AREA+"-"+t.getId()}}),r=i.filter(function(e){return a.every(function(t){return t.id!==e.id})}).map(function(t){return e.CSS_CLASS_AREA+"-"+t.id});r.length>0&&this._chart.regions.remove({classes:r});var n=a.filter(function(e){return i.every(function(t){return t.id!==e.id})});n.length>0&&this._chart.regions.add(n);var s=a.filter(function(e){var t=i.find(function(t){return t.id===e.id});return t&&!1===_.isEqual(e,t)});s.length>0&&this._chart.regions(s),this._updateAreaStyles()},_mapChartLineToC3Line:function(e){var t=e.getShowLineSelector()?this.CSS_CLASS_LINE_SHOWSELECTOR:"",i=e.getSelectorIconOnly()?this.CSS_CLASS_LINE_ICONONLY:"";return{id:e.getId(),value:e.getValue(),axis:e.getAxis(),text:e.getTitle(),position:e.getTitlePosition(),showSelector:!!e.getShowLineSelector(),class:this.CSS_CLASS_LINE+" "+this.CSS_CLASS_LINE+"-"+e.getStyle()+" "+this.CSS_CLASS_LINE+"-"+e.getId()+" "+t+" "+i}},_onSeriesVisibilityUpdate:function(e){var t=e.getParameter("chartSeries");t.getVisible()?this._chart.show(t.getKey(),{withLegend:!0}):this._chart.hide(t.getKey(),{withLegend:!0})},_updateSeriesStyles:function(){var e=this;this.getSeries().forEach(function(t){var i=void 0,a=void 0;switch(e._isShapeType(t.getType())?t.getShapeStyle():r.ShapeStyle.Default){case r.ShapeStyle.Striped:a=e._chart.data.colors()[t.getKey()],d3.select("#"+e.getId()+" defs #"+e.getId()+"-stripe-pattern-"+t.getKey()).empty()&&d3.select("#"+e.getId()+" defs").append("pattern").attr({id:e.getId()+"-stripe-pattern-"+t.getKey(),width:"8",height:"8",patternUnits:"userSpaceOnUse",class:"stripe-pattern-"+t.getKey()}).append("path").attr({d:"M1,0L5,0L0,5L0,1L1,0 M8,1L8,5L5,8L1,8L8,1"}),(i=d3.select("#"+e.getId()+" defs #"+e.getId()+"-stripe-style-"+t.getKey())).empty()&&(i=d3.select("#"+e.getId()+" defs").append("style").attr({id:e.getId()+"-stripe-style-"+t.getKey(),type:"text/css"})),i.text("#"+e.getId()+" .stripe-pattern-"+t.getKey()+" path {\n                                    fill: "+a+";\n                                    stroke: none;\n                                }\n                                #"+e.getId()+" .c3-target-"+t.getKey()+" .c3-shape {\n                                    fill: url(#"+e.getId()+"-stripe-pattern-"+t.getKey()+") !important;\n                                }");break;case r.ShapeStyle.Default:default:(i=d3.select("#"+e.getId()+" defs #"+e.getId()+"-stripe-style-"+t.getKey())).empty()||i.text("")}}),this.getSeries().forEach(function(t){var i=void 0,a=void 0,n=e._isLineType(t.getType())?t.getLineStyle():r.LineStyle.Default,s=void 0;switch(t.getLineAnimationSpeed()){case r.AnimationSpeed.Fast:s=20;break;case r.AnimationSpeed.Medium:s=50;break;case r.AnimationSpeed.Slow:s=150;break;case r.AnimationSpeed.None:default:s=0}switch(n){case r.LineStyle.Dashed:case r.LineStyle.Dotted:a="dotted"===t.getLineStyle()?"1 5":"5",(i=d3.select("#"+e.getId()+" defs #"+e.getId()+"-dashdot-style-"+t.getKey())).empty()&&(i=d3.select("#"+e.getId()+" defs").append("style").attr({id:e.getId()+"-dashdot-style-"+t.getKey(),type:"text/css"})),i.text("#"+e.getId()+" .c3-target-"+t.getKey()+" .c3-shape {\n                                    stroke-dashoffset: "+(t.getLineAnimationForwards()?"":"-")+"50rem;\n                                    stroke-dasharray: "+a+";\n                                    stroke-linecap: round;\n\n                                    -webkit-animation: ui5-viz-chart-dash-animation "+s+"s 0s linear infinite forwards;\n                                    -moz-animation: ui5-viz-chart-dash-animation "+s+"s 0s linear infinite forwards;\n                                    -ms-animation: ui5-viz-chart-dash-animation "+s+"s 0s linear infinite forwards;\n                                    -o-animation: ui5-viz-chart-dash-animation "+s+"s 0s linear infinite forwards;\n                                    animation: ui5-viz-chart-dash-animation "+s+"s 0s linear infinite forwards;\n                                }");break;case r.LineStyle.Default:default:(i=d3.select("#"+e.getId()+" defs #"+e.getId()+"-dashdot-style-"+t.getKey())).empty()||i.text("")}})},_updateLineStyles:function(){var e=this,t="",i=d3.select("#"+this.getId()+" defs #"+this.getId()+"-line-style");i.empty()&&(i=d3.select("#"+this.getId()+" defs").append("style").attr({id:this.getId()+"-line-style",type:"text/css"})),this.getLines().forEach(function(i){var a=i.getColor();a&&(t+="#"+e.getId()+" ."+e.CSS_CLASS_LINE+"-"+i.getId()+" line {\n                                stroke: "+a+";\n                            }\n\n                            #"+e.getId()+" ."+e.CSS_CLASS_LINE+"-"+i.getId()+" circle {\n                                stroke: "+a+";\n                            }\n\n                            #"+e.getId()+" ."+e.CSS_CLASS_LINE+"-"+i.getId()+" text {\n                                fill: "+a+";\n                            }");var r=d3.select("#"+e.getId()+" .ui5-viz-chart-line-"+i.getId()),n=sap.ui.core.IconPool.getIconInfo(i.getLineSelectorIcon());i.getShowLineSelector()?(r.select(".c3-grid-lines-circle-text").attr("font-family",n.fontFamily).text(n.content),r.select(".c3-grid-lines-circle-hover").on("click",function(){i.fireSelectorPress({line:i,selectorDomRef:this.previousSibling})})):r.select(".c3-grid-lines-circle-hover").on("click",function(){})}),i.text(t)},_updateAreaStyles:function(){var e=this,t="",i=d3.select("#"+this.getId()+" defs #"+this.getId()+"-area-style");i.empty()&&(i=d3.select("#"+this.getId()+" defs").append("style").attr({id:this.getId()+"-area-style",type:"text/css"})),this.getAreas().forEach(function(i){var a=i.getColor()||"#000000";switch(i.getStyle()){case r.ShapeStyle.Striped:d3.select("#"+e.getId()+" defs #"+e.getId()+"-area-stripe-pattern-"+i.getId()).empty()&&d3.select("#"+e.getId()+" defs").append("pattern").attr({id:e.getId()+"-area-stripe-pattern-"+i.getId(),width:"8",height:"8",patternUnits:"userSpaceOnUse",class:"area-stripe-pattern-"+i.getId()}).append("path").attr({d:"M1,0L5,0L0,5L0,1L1,0 M8,1L8,5L5,8L1,8L8,1"}),t+="#"+e.getId()+" .area-stripe-pattern-"+i.getId()+" path {\n                                    fill: "+a+";\n                                    stroke: none;\n                                }\n                                #"+e.getId()+" ."+e.CSS_CLASS_AREA+"-"+i.getId()+" rect.c3-region-stripe,\n                                #"+e.getId()+" ."+e.CSS_CLASS_AREA+"-"+i.getId()+" text.c3-region-text {\n                                    fill: "+a+";\n                                }\n                                #"+e.getId()+" ."+e.CSS_CLASS_AREA+"-"+i.getId()+" rect.c3-region-area {\n                                    fill: url(#"+e.getId()+"-area-stripe-pattern-"+i.getId()+") !important;\n                                }";break;case r.ShapeStyle.Default:default:t+="#"+e.getId()+" ."+e.CSS_CLASS_AREA+"-"+i.getId()+" rect.c3-region-stripe,\n                                #"+e.getId()+" ."+e.CSS_CLASS_AREA+"-"+i.getId()+" text.c3-region-text {\n                                    fill: "+a+";\n                                }\n                                #"+e.getId()+" ."+e.CSS_CLASS_AREA+"-"+i.getId()+" rect.c3-region-area {\n                                    fill: "+a+";\n                                }"}}),i.text(t)},_isShapeType:function(e){var t=!1;switch(e){case r.ChartSeriesType.Bar:t=!0;break;default:t=!1}return t},_isLineType:function(e){var t=!1;switch(e){case r.ChartSeriesType.Line:case r.ChartSeriesType.Spline:case r.ChartSeriesType.Step:case r.ChartSeriesType.AreaLine:case r.ChartSeriesType.AreaSpline:case r.ChartSeriesType.AreaStep:case r.ChartSeriesType.RibbonLine:case r.ChartSeriesType.RibbonSpline:case r.ChartSeriesType.RibbonStep:t=!0;break;default:t=!1}return t},_isRibbonType:function(e){return e===(r.ChartSeriesType.RibbonLine||r.ChartSeriesType.RibbonSpline||r.ChartSeriesType.RibbonStep)},_getAvailableSize:function(e){var t=0;return e="width"===e||"height"===e?e:"width",this.getDomRef()&&("width"===e?(t+=parseInt(getComputedStyle(this.getDomRef(),"").marginLeft.match(/(\d*(\.\d*)?)/,10)[1])||0,t+=parseInt(getComputedStyle(this.getDomRef(),"").marginRight.match(/(\d*(\.\d*)?)/,10)[1])||0):(t+=parseInt(getComputedStyle(this.getDomRef(),"").marginTop.match(/(\d*(\.\d*)?)/,10)[1])||0,t+=parseInt(getComputedStyle(this.getDomRef(),"").marginBottom.match(/(\d*(\.\d*)?)/,10)[1])||0)),$(this._getParentDomRef())[e]()-t},_getComputedSize:function(e,t){e=e||"auto",t="width"===t||"height"===t?t:"width";var i,a=r.parseCSSSize(e),n=1;switch(a.unit){case"rem":i=parseInt(getComputedStyle(document.body,"").fontSize.match(/(\d*(\.\d*)?)/,10)[1])||0;break;case"em":i=parseInt(getComputedStyle(this._getParentDomRef(),"").fontSize.match(/(\d*(\.\d*)?)/,10)[1])||0;break;case"px":i=a.value&&a.value>0?a.value:this._getAvailableSize(t);break;case"vw":n=(a.value&&a.value>0?a.value:100)/100,i=this._getAvailableSize("width")*n;break;case"vh":n=(a.value&&a.value>0?a.value:100)/100,i=this._getAvailableSize("height")*n;break;case"%":n=(a.value&&a.value>0?a.value:100)/100,i=this._getAvailableSize(t)*n;break;case"initial":case"inherit":case"auto":i=this._getAvailableSize(t);break;default:jQuery.sap.log.warning("CSS unit "+a.unit+' is not supported, yet. Fallback to "auto" (max. width).'),i=this._getAvailableSize(t)}return i},_resize:function(){return this._chart&&this._chart.resize({width:this.getWidth(),height:this.getHeigth()}),this},_getParentDomRef:function(){var e=this.getDomRef()?this.getDomRef().parentNode:document.body;return e||document.body}})},!0);