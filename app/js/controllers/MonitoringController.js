define([
	'dojo/_base/declare',
    'dojo/Evented',
    'dojo/_base/lang',
    'dojo/when',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/topic',
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
    'controllers/MenusController',
    'text!templates/monitoringMenu.tpl.html',   
    'esri/tasks/ImageServiceIdentifyTask',
    'esri/layers/MosaicRule',
    'esri/tasks/ImageServiceIdentifyParameters',
    'widgets/MonitoringWidget',
    'dojo/domReady!'	
	], function(declare, Evented, lang, when, on, dom, domConstruct, domAttr, Topic,
		_WidgetBase, _TemplatedMixin, MenusController, template,
        ImageServiceIdentifyTask, MosaicRule, ImageServiceIdentifyParameters, MonitoringWidget){
		
		return declare([Evented, _WidgetBase, _TemplatedMixin], {
			templateString: template,
            activeMosaic: null,
            activeRaster: null,
            handler: null,
            monitoringWidget: null,

		constructor: function(args){
			console.log("Soy MonitoringController");
			lang.mixin(this, args);
	    },

	    postCreate: function(){
            this.handler = on.pausable(this.map, 'click', lang.hitch(this, '_showClickedPoint'));
            //Stops the "click" handler until a raster will be selected.
            Topic.subscribe("mosaic/raster-click", lang.hitch(this, '_rasterValuesCompleted'));

            this.handler.pause();
           
	    },

        _showClickedPoint: function(evt){
           // console.log('\nX: ' + evt.mapPoint.x + "\nY: " + evt.mapPoint.y);
            this.mosaics[this.activeMosaic].getRasterValues(evt.mapPoint);

            /*var mosaicRule = new MosaicRule();
            mosaicRule.ascending = true;
            //mosaicRule.method = MosaicRule.METHOD_LOCKRASTER;
            mosaicRule.method = MosaicRule.METHOD_ATTRIBUTE;
            mosaicRule.sortField = "OBJECTID";
            //mosaicRule.lockRasterIds = [this.activeRaster];

            var parameters = new ImageServiceIdentifyParameters();
            parameters.mosaicRule = mosaicRule;
            parameters.geometry = evt.mapPoint;
            //parameters.returnCatalogItems = false;

            var identifyTask = new ImageServiceIdentifyTask(this.mosaics[this.activeMosaic].URL);

            identifyTask.execute(parameters, lang.hitch(this, '_querySuccess'));*/
        },

        _rasterValuesCompleted: function(){
            var constructDiv = function(){
                var div = domConstruct.create("div");
                domAttr.set(div, "id", "monitoring-widget-container");
                var container = dom.byId("monitoring-div");
                domConstruct.place(div, container, "last");
            }
            
            if(this.monitoringWidget!=null){
                this.monitoringWidget.destroy();
            }
            constructDiv();
            //console.log(arguments);
            var allValues = arguments[0];
            var actualValue = allValues[this.activeRaster-1];
            
            this.monitoringWidget = new MonitoringWidget({actualValue: actualValue, rasterValues: allValues}, 'monitoring-widget-container');
        
        },

        getActiveMosaicAndRaster: function(){
            return [this.activeMosaic, this.activeRaster];
        },

        _showRaster: function(mosaicId, rasterId, rasterDate){
            var rasterButton = dom.byId("raster-selector-button");
            rasterButton.innerHTML = rasterDate;
            this.activeMosaic = mosaicId;
            this.activeRaster = rasterId;
             
            this.emit("raster-selected",{});

            //Now the click handler is active.
            this.handler.resume();
        },

        _populateRasterList: function(rastersList, mosaicId, mosaicName){
            //Stops the "click" handler until a raster will be selected.
            this.handler.pause();

            var container = dom.byId("rasters-list-ul");
            var mosaicButton = dom.byId("mosaic-selector-button");
            mosaicButton.innerHTML = mosaicName;
            var rasterButton = dom.byId("raster-selector-button");
            rasterButton.innerHTML = "Select Raster";

            container.innerHTML =""; 
            for(var raster in rastersList){
                var rasterId = rastersList[raster][0];
                var rasterDate = rastersList[raster][1];
                var li = domConstruct.create("li");
                domAttr.set(li, "rasterId", rasterId);
                var a = domConstruct.create("a");
                a.innerHTML = rasterDate;
                domAttr.set(a,"href","#");
                var clickHandler = lang.hitch(this, "_showRaster", mosaicId, raster, rasterDate);
                this.own(on(a, "click", clickHandler));
                domConstruct.place(a, li, "only");
                domConstruct.place(li, container, "last");
            }
            
        },

        populateMosaicsList: function(){
        	var container = dom.byId('mosaics-list-ul');

        	for(var mosaic in this.mosaics){
        		var mosaicId = this.mosaics[mosaic].mosaicId;
        		var mosaicName = this.mosaics[mosaic].name;
        		var li = domConstruct.create("li");
        		domAttr.set(li, "mosaicId", mosaicId);
        		//domAttr.set(li, "class", mosaicId);

        		var a = domConstruct.create("a");
        		a.innerHTML = mosaicName;
        		domAttr.set(a,"href","#");
                var clickHandler = lang.hitch(this, "_populateRasterList", this.mosaics[mosaic].rasters, mosaicId, mosaicName);
                this.own(on(a, "click", clickHandler));
        		domConstruct.place(a,li,"only");
        		domConstruct.place(li, container, "last");
        	}
        }

      
	});

});