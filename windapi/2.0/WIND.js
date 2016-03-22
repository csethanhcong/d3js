/*
 * Web INteraction Design (WIND)
 * Interaction Design API v2.0
 *
 * Copyright (c) 2009-2012 The Nhan LUONG
 * thenhan.luong@iutbayonne.univ-pau.fr
 *
 * $Date: 2012/02/12 $
 */
// Namespace to protect this library from conflicting with external


var WIND = WIND || {};
// New
WIND.Annotation2DisplayerProxy = function (el, group, displayer) {
    this._displayer = displayer;
    this._group = group;
    // Init the DDProxy
    WIND.Annotation2DisplayerProxy.superclass.constructor.call(this, el, "Annotation2Displayer", {
        dragElId: "annotation2DisplayerProxy"
    });

    this.isTarget = false;
};

// YAHOO.lang.extend(WIND.Annotation2DisplayerProxy, YAHOO.util.DDProxy, {

//     /**
//      * copy the html and apply selected classes
//      * @method startDrag
//      */
//     startDrag: function (e) {
//         WIND.Annotation2DisplayerProxy.superclass.startDrag.call(this, e);
//         var del = this.getDragEl();
//         var lel = this.getEl();
//         var innerHTML = "";
//         var width = 0;
//         //alert(this._group.annotedObjects.length);
//         for (var i = 0; i < this._group.annotedObjects.length; i++) {
//             innerHTML += document.getElementById(this._group.annotedObjects[i].object).innerHTML + " ";
//             width += Number(document.getElementById(this._group.annotedObjects[i].object).innerHTML.length) * 5 + 4;
//         }
//         //del.innerHTML = lel.innerHTML;
//         del.innerHTML = innerHTML;
//         this.innerHTML = innerHTML;
//         del.style.width = (width > 0) ? (width + "px") : "100px";
//         //del.className = "Text2Drag";
//     },

//     /**
//      * Override default behavior of DDProxy
//      * @method endDrag
//      */
//     endDrag: function (e) {},

//     /**
//      * Add the module to the WINDMash on drop on layer
//      * @method onDragDrop
//      */
//     onDragDrop: function (e, ddTargets) {
//         var layerTarget = ddTargets;
//         var del = this.getDragEl();
//         var pos = YAHOO.util.Dom.getXY(del);
//         var dislayerPos = YAHOO.util.Dom.getXY(ddTargets);

//         if (this._displayer.type == "timeline") {
//             var frise = this._displayer;
//             var mindate = frise.tl.getBand(0).getMinVisibleDate();
//             var maxdate = frise.tl.getBand(0).getMaxVisibleDate();
//             var tlWidth = frise.width;
//             var computedDate = new Date(Math.round((pos[0] - dislayerPos[0]) * (maxdate - mindate) / tlWidth) + (mindate - new Date(0)));
//             var parseDateTimeFunction = frise.eventSource._events.getUnit().getParser("iso8601");
//             var evt = new Timeline.DefaultEventSource.Event({
//                 //'id': "Event " + this._part.word,
//                 'id': this.innerHTML,
//                 'start': computedDate, //parseDateTimeFunction("2000-09-20"), 
//                 //'end': parseDateTimeFunction("2010-09-20"), 
//                 //'latestStart': parseDateTimeFunction("2000-09-20"), 
//                 //'earliestEnd': parseDateTimeFunction("2000-09-20"), 
//                 'instant': true,
//                 'text': this.innerHTML, //this._part.word, 
//                 'description': this.innerHTML //this._part.word
//             });
//             frise.eventSource.add(evt);
//             frise.tl.layout();
//         }
//         //var layerPos = YAHOO.util.Dom.getXY(ddTarget.container);

//         //this._WINDMash.addSDLine(this._module, [pos[0]-layerPos[0], pos[1]-layerPos[1]]);
//         //this._WINDMash.onLayerChanged();
//     }
// });

// Interaction class 
WIND.Interaction = function (evt, reacts) {
    this.event = evt;
    if (reacts == null) {
        this.reactions = [];
    } else if (reacts instanceof Array) {
        this.reactions = reacts;
    } else {
        this.reactions = [reacts];
    }
};
WIND.Interaction.prototype.addReaction = function (react) {
    if (react instanceof Array) {
        for (var i = 0; i < react.length; i++) {
            this.reactions.push(react[i]);
        }
    } else {
        this.reactions.push(react);
    }
};
WIND.Interaction.prototype.runReactions_ = function () {
    var tmp = this.reactions;
    for (var j = 0; j < tmp.length; j++) {
        if (tmp[j] instanceof WIND.ExternalReaction) {
            var cible;
            if (tmp[j].annotationApplied == null) {
                var newtab = new Array();
                var temp2 = tmp[j];
                while (temp2.dependency != null) {
                    newtab.push(temp2.dependency);
                    temp2 = temp2.dependency;
                }
                for (var i = newtab.length - 1; i > 0; i--) {
                    newtab[i - 1].source = newtab[i].raise();
                }
                cible = newtab[0].raise();
            } else
                cible = tmp[j].annotationApplied;
            if (cible instanceof WIND.Annotation) {
                for (var l = 0; l < cible.annotedObjects.length; l++) {
                    cible.annotedObjects[l].callFunction(tmp[j].effect_type, tmp[j].parameters);
                }
            }
        }
    }
};
WIND.Interaction.prototype.activate = function () {
    var tmp = this.reactions;
    for (var j = 0; j < tmp.length; j++) {
        //alert("reaction " + j);
        if (tmp[j] instanceof WIND.ExternalReaction) {
            var cible;
            if (tmp[j].annotationApplied == null) {
                var newtab = new Array();
                var temp2 = tmp[j];
                while (temp2.dependency != null) {
                    newtab.push(temp2.dependency);
                    temp2 = temp2.dependency;
                }
                //alert("dependency = " + newtab.length);
                for (var i = newtab.length - 1; i > 0; i--) {
                    newtab[i - 1].source = newtab[i].raise();
                }
                cible = newtab[0].raise();
            } else
                cible = tmp[j].annotationApplied;
            if (cible instanceof WIND.Annotation) {
                for (var l = 0; l < cible.annotedObjects.length; l++) {
                    cible.annotedObjects[l].callFunction(tmp[j].effect_type, tmp[j].parameters);
                }
            }
        }
    }
    /*
	var evt = this.event;
	if (evt.target == "all") {
		if (evt instanceof WIND.SelectEvent) {
			if (evt.annotationSelected instanceof WIND.Selection) {
				for (var ii=0; ii<evt.annotationSelected.set.length; ii++) {
					var tmpAnnot = evt.annotationSelected.set[ii];
					for (var i=0; i<tmpAnnot.contains.length; i++) {
						if (tmpAnnot.contains[i].type == "text") {
							tmpAnnot.contains[i].parentComponent.interactionList.push(this);
							tmpAnnot.contains[i].parentComponent.activateInteraction(this);
							break;
						}
						// other cases
					}
				}
			}
			else {
				for (var i=0; i<evt.annotationSelected.contains.length; i++) {
					if (evt.annotationSelected.contains[i].type == "text") {
						evt.annotationSelected.contains[i].parentComponent.interactionList.push(this);
						evt.annotationSelected.contains[i].parentComponent.activateInteraction(this);
					}
					// other cases
				}
			}
		}
		else if (evt instanceof WIND.InputEvent) {
			for (var i=0; i<evt.annotationCreated.contains.length; i++) {
				if (evt.annotationCreated.contains[i].type == "text") {
					evt.annotationCreated.contains[i].parentComponent.interactionList.push(this);
					evt.annotationCreated.contains[i].parentComponent.activateInteraction(this);
				}
				// other cases
			}
		}
	}
	else {
		if (evt.target.type == "text") {
			evt.target.parentComponent.interactionList.push(this);
			evt.target.parentComponent.activateInteraction(this);
		}
		// other cases
	}
	*/
};

// Event class
WIND.UserEvent = function (type) {
    this.type = type;
};
WIND.SelectEvent = function (evt, annot, rep) {
    this.event_type = evt;
    this.annotationSelected = annot;
    if (rep == null) this.target = "all";
    else this.target = rep;
};
WIND.SelectEvent.prototype = new WIND.UserEvent("SelectEvent");
WIND.SelectEvent.prototype.trigger = function (callback) {
    //if (this.annotationSelected instanceof WIND.Selection) {
    if (this.annotationSelected instanceof Array) {
        //for (var k=0; k<this.annotationSelected.set.length; k++) {
        for (var k = 0; k < this.annotationSelected.length; k++) {
            //var tmpAnnot = this.annotationSelected.set[k];
            var tmpAnnot = this.annotationSelected[k];
            //var mySet = this.annotationSelected.set;
            var mySet = this.annotationSelected;
            for (var l = 0; l < tmpAnnot.annotedObjects.length; l++) {
                if ((tmpAnnot.annotedObjects[l] instanceof WIND.Text.Part) || (tmpAnnot.annotedObjects[l] instanceof WIND.List.Part)) {
                    tmpAnnot.annotedObjects[l].setStyle("text-decoration:underline;cursor:pointer");
                    YAHOO.util.Event.addListener(document.getElementById(tmpAnnot.annotedObjects[l].object), this.event_type, function (e) {
                        var evtObj = YAHOO.util.Event.getTarget(e);
                        var clicked;
                        for (var x = 0; x < mySet.length; x++) {
                            var tmpAnnot2 = mySet[x];
                            for (var y = 0; y < tmpAnnot2.annotedObjects.length; y++) {
                                if (tmpAnnot2.annotedObjects[y].object == evtObj.id) {
                                    clicked = tmpAnnot2;
                                    break;
                                }
                            }
                        }
                        if (clicked) {
                            //alert("clicked = " + clicked);
                            this.annotationSelected = clicked;
                            callback(this);
                        }
                    }, this, true);
                }
                /*else if (tmpAnnot.annotedObjects[l] instanceof WIND.List.Part) {
					tmpAnnot.annotedObjects[l].setStyle("text-decoration:underline;cursor:pointer");
					YAHOO.util.Event.addListener(document.getElementById(tmpAnnot.annotedObjects[l].object), this.event_type, function(e) {
						var evtObj = YAHOO.util.Event.getTarget(e);
						var clicked;
						for (var x=0; x<mySet.length; x++) {
							var tmpAnnot2 = mySet[x];
							for (var y=0; y<tmpAnnot2.annotedObjects.length; y++) {
								if (tmpAnnot2.annotedObjects[y].object == evtObj.id) {
									clicked = tmpAnnot2;
									break;
								}
							}
						}
						if (clicked) {
							this.annotationSelected = clicked;
							callback(this);
						}
					}, this, true);
				}*/
            }
        }
    } else {
        var tmpAnnot = this.annotationSelected;
        for (var l = 0; l < tmpAnnot.annotedObjects.length; l++) {
            tmpAnnot.annotedObjects[l].setStyle("text-decoration:underline;cursor:pointer");
            YAHOO.util.Event.addListener(document.getElementById(tmpAnnot.annotedObjects[l].object), this.event_type, function (e) {
                callback(this);
            }, this, true);
        }
    }
};
WIND.InputEvent = function (evt, obj) {
    this.event_type = evt;
    this.event_tool = obj;
    //this.parameters = obj;
    this.annotationCreated = null;
    this.target = "all";
};
WIND.InputEvent.prototype = new WIND.UserEvent("InputEvent");
WIND.InputEvent.prototype.trigger = function (callback) {
    this.event_tool.button.on("checkedChange", function (e1) {
        if (!e1.prevValue) {
            document.getElementById(this.event_tool.parentComponent.container).style.cursor = "url(http://erozate.iutbayonne.univ-pau.fr/Nhan/windapi/crayon.png) 2 8";
            YAHOO.util.Event.addListener(this.event_tool.parentComponent.paragraphs[0].object, "mouseup", function (e) {
                //alert("click");
                //clic sur le bouton Ajouter : mettre dans Georeferenceurs choisis		
                var str = null;
                if (window.getSelection) {
                    str = window.getSelection();
                } else if (document.getSelection) {
                    str = document.getSelection();
                } else {
                    str = document.selection.createRange();
                }

                var rang = null;
                if (str.getRangeAt) {
                    rang = str.getRangeAt(0);
                    rang.setStart(str.anchorNode, 0);
                    rang.setEnd(str.focusNode, str.focusNode.nodeValue.length);
                } else { // Safari!
                    rang = document.createRange();
                    rang.setStart(str.anchorNode, str.anchorOffset);
                    rang.setEnd(str.focusNode, str.focusOffset);
                }

                var texteselectionne = rang.toString();
                //alert("..." + texteselectionne + "...");
                if (texteselectionne.endsWith(" ")) texteselectionne = texteselectionne.substring(0, texteselectionne.length - 1);
                //alert("..." + texteselectionne + "...");
                //alert(texteselectionne);
                var debut = -1;
                var fin = -1;

                var words = this.event_tool.parentComponent.paragraphs[0].words;
                for (var i = 0; i < words.length; i++) {
                    if (texteselectionne.startsWith(words[i])) {
                        var ok = true;
                        debut = i;
                        //alert(debut);
                        //if (debut >=0) {			
                        for (var j = debut; j < words.length; j++) {
                            if (texteselectionne.endsWith(words[j])) {
                                //alert("day roi: " + words[i]);
                                fin = j;
                                for (var k = debut; k <= fin; k++) {
                                    if (texteselectionne.indexOf(words[k]) == -1) {
                                        ok = false;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        //}
                        if (ok) break;
                    }
                }

                //alert(debut + " ... " + fin);
                //alert(words[debut] + " ... " + words[fin]);
                //alert(this.event_tool.parentComponent.container);
                var tab = new Array();
                if (fin >= debut && debut >= 0) {
                    if (confirm('Do you want really to annotate "' + texteselectionne + '" in the text?')) {
                        for (var j = debut + 1; j <= fin + 1; j++) {
                            document.getElementById(this.event_tool.parentComponent.paragraphs[0].object + "_token" + j).style.color = "#008000";
                            tab.push(j);
                        }
                        str.removeAllRanges();
                        //var annot = {};
                        //annot.entity = texteselectionne;
                        //annot.annotedObjects = tab;

                        var annot = this.event_tool.parentComponent.createAnnotation("Place", texteselectionne, 1, debut + 1, fin + 1, null);
                        //if ((document.getElementById("semanticInput").value) && (document.getElementById("semanticInput").value != ""))
                        //annot.semantics = document.getElementById("semanticInput").value;
                        //else
                        //	annot.semantics = "Place";
                        //valeurs.push(annot);
                        annot.contains = new Array();
                        var rep = new WIND.Representation("text", annot, this.event_tool.parentComponent);
                        this.annotationCreated = annot;
                        callback(this);
                    }
                }
            }, this, true);
        } else {
            document.getElementById(this.event_tool.parentComponent.container).style.cursor = "auto";
            YAHOO.util.Event.removeListener(this.event_tool.parentComponent.paragraphs[0].object, "mouseup");
        }
    }, this, true);
};

WIND.Tool = function (type) {
    this.type = type;
};


// Reaction class
WIND.SystemReaction = function () {};
WIND.SystemReaction.prototype.setDependency = function (reac) {
    this.dependency = reac;
};

WIND.InternalReaction = function (type) {
    this.type = type;
};
WIND.InternalReaction.prototype = new WIND.SystemReaction();

WIND.Projection = function (src, tgt) {
    this.source = src;
    this.target = tgt;
    this.result = null;
};
WIND.Projection.prototype = new WIND.InternalReaction("Projection");
WIND.Projection.prototype.raise = function () {
    var annot = false;
    //alert("projection");
    if (this.target.type == "text") {
        // Tricher 
        if (this.source == null) {
            this.source = this.dependency.result;
        }
        var p;
        if (this.target.paragraphs.length == 0) p = this.target.createParagraph();
        else p = this.target.paragraphs[0];
        p.setContent(this.source.entity);
        annot = this.target.createAnnotation(this.source.semantics, this.source.entity, 1, 1, this.source.annotedObjects.length);
    } else if (this.target.type == "map") {
        //annot = this.target.createAnnotation(this.source.semantics,this.source.entity,null,{"style":"strokeColor:#0033CC,strokeWidth:3,fillColor:#FF9900"});
        //var mappart = this.createSensiblePart(geodata, options);
        //alert("projection to map");
        annot = new WIND.Annotation(this.source.semantics, this.source.entity, null);
        var newtab = new Array();
        for (var i = 0; i < this.source.annotedObjects.length; i++) {
            if (this.source.annotedObjects[i] instanceof WIND.Map.Part) {
                newtab.push(this.source.annotedObjects[i]);
            }
        }
        annot.annotedObjects = newtab;

        //alert("toto" + annot.annotedObjects.length);
        this.target.annotations.push(annot);
        for (var i = 0; i < annot.annotedObjects.length; i++) {
            this.target.addSensiblePart(annot.annotedObjects[i], true);
            annot.annotedObjects[i].viewer = this.target;
        }
    }
    this.result = annot;
    return annot;
};

WIND.Calculation = function (src, func, tgt) {
    this.source = src;
    this.func = func;
    this.target = tgt;
    this.result = null;
};
WIND.Calculation.prototype = new WIND.InternalReaction("Calculation");
WIND.Calculation.prototype.raise = function () {
    var annot = false;

    if (this.func == "point_of_place") {
        var xhr = createXHR();
        var cibleViewer = this.target;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var results = xhr.responseXML;
                    if (results.getElementsByTagName("geoname")) {
                        var pref = results.getElementsByTagName("geoname")[0];
                        annot = new WIND.Annotation("http://geotopia.univ-pau.fr/GeotopiaService#Town", pref.getElementsByTagName("name")[0].childNodes[0].nodeValue, null);

                        var mystyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                        mystyle.strokeColor = "#0033CC";
                        mystyle.fillColor = "#809FFE";
                        mystyle.fillOpacity = 0.3;

                        var mappart = new WIND.Map.Part("POINT(" + pref.getElementsByTagName("lng")[0].childNodes[0].nodeValue + " " + pref.getElementsByTagName("lat")[0].childNodes[0].nodeValue + ")", null, mystyle);
                        mappart.geoname = pref.getElementsByTagName("name")[0].childNodes[0].nodeValue;
                        mappart.display = false;

                        mappart.viewer = cibleViewer;
                        mappart.vlayer = cibleViewer.vectorLayer;
                        annot.addSensiblePart(mappart, true);

                    }
                }
            }
        };
        xhr.open("GET", "http://erozate.iutbayonne.univ-pau.fr/Nhan/windapi/php/geonames_get.php?place=" + this.source.entity, false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        xhr.send(null);
    } else if (this.func == "geolocation_of_town") {
        var xhr = createXHR();
        var cibleViewer = this.target;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var results = xhr.responseXML;
                    if (results.getElementsByTagName("geoname")) {
                        var pref = results.getElementsByTagName("geoname")[0];
                        annot = new WIND.Annotation("http://geotopia.univ-pau.fr/GeotopiaService#Town", pref.getElementsByTagName("nom_com")[0].childNodes[0].nodeValue, null);

                        var mystyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                        mystyle.strokeColor = "#0033CC";
                        mystyle.fillColor = "#809FFE";
                        mystyle.fillOpacity = 0.3;

                        var mappart = new WIND.Map.Part(pref.getElementsByTagName("astext")[0].textContent, null, mystyle);
                        mappart.geoname = pref.getElementsByTagName("nom_com")[0].childNodes[0].nodeValue;
                        mappart.display = false;

                        mappart.viewer = cibleViewer;
                        mappart.vlayer = cibleViewer.vectorLayer;
                        annot.addSensiblePart(mappart, true);

                    }
                }
            }
        };
        xhr.open("GET", "http://erozate.iutbayonne.univ-pau.fr/Nhan/windapi/php/geolocation_of_town.php?place=" + this.source.entity, false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        xhr.send(null);
    } else if (this.func == "prefecture_of_town") {
        var xhr = createXHR();
        var cibleViewer = this.target;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var results = xhr.responseXML;
                    if (results.getElementsByTagName("geoname")) {
                        var pref = results.getElementsByTagName("geoname")[0];
                        annot = new WIND.Annotation("http://geotopia.univ-pau.fr/GeotopiaService#Prefecture", pref.getElementsByTagName("nom_chf_l")[0].childNodes[0].nodeValue, null);

                        var mystyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                        mystyle.strokeColor = "#0033CC";
                        mystyle.fillColor = "#809FFE";
                        mystyle.fillOpacity = 0.3;

                        var mappart = new WIND.Map.Part(pref.getElementsByTagName("astext")[0].textContent, null, mystyle);
                        mappart.geoname = pref.getElementsByTagName("nom_chf_l")[0].childNodes[0].nodeValue;
                        mappart.display = false;

                        mappart.viewer = cibleViewer;
                        mappart.vlayer = cibleViewer.vectorLayer;
                        annot.addSensiblePart(mappart, true);
                    }
                }
            }
        };
        xhr.open("GET", "http://erozate.iutbayonne.univ-pau.fr/Nhan/windapi/php/prefecture_of_town.php?place=" + this.source.entity, false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        xhr.send(null);
    } else if (this.func == "prefecture_of_department") {
        var xhr = createXHR();
        var cibleViewer = this.target;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var results = xhr.responseXML;
                    if (results.getElementsByTagName("geoname")) {
                        var pref = results.getElementsByTagName("geoname")[0];
                        annot = new WIND.Annotation("http://geotopia.univ-pau.fr/GeotopiaService#Prefecture", pref.getElementsByTagName("nom_chf_l")[0].childNodes[0].nodeValue, null);

                        var mystyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                        mystyle.strokeColor = "#0033CC";
                        mystyle.fillColor = "#809FFE";
                        mystyle.fillOpacity = 0.3;

                        var mappart = new WIND.Map.Part(pref.getElementsByTagName("astext")[0].textContent, null, mystyle);
                        mappart.geoname = pref.getElementsByTagName("nom_chf_l")[0].childNodes[0].nodeValue;
                        mappart.display = false;

                        mappart.viewer = cibleViewer;
                        mappart.vlayer = cibleViewer.vectorLayer;
                        annot.addSensiblePart(mappart, true);
                    }
                }
            }
        };
        xhr.open("GET", "http://erozate.iutbayonne.univ-pau.fr/Nhan/windapi/php/prefecture_of_department.php?place=" + this.source.entity, false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        xhr.send(null);
    } else if (this.func == "department_of_town") {
        var xhr = createXHR();
        var cibleViewer = this.target;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var results = xhr.responseXML;
                    if (results.getElementsByTagName("geoname")) {
                        var pref = results.getElementsByTagName("geoname")[0];
                        annot = new WIND.Annotation("http://geotopia.univ-pau.fr/GeotopiaService#Department", pref.getElementsByTagName("nom_dept")[0].childNodes[0].nodeValue, null);

                        var mystyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                        mystyle.strokeColor = "#0033CC";
                        mystyle.fillColor = "#809FFE";
                        mystyle.fillOpacity = 0.3;

                        var mappart = new WIND.Map.Part(pref.getElementsByTagName("astext")[0].textContent, null, mystyle);
                        mappart.geoname = pref.getElementsByTagName("nom_dept")[0].childNodes[0].nodeValue;
                        mappart.display = false;

                        mappart.viewer = cibleViewer;
                        mappart.vlayer = cibleViewer.vectorLayer;
                        annot.addSensiblePart(mappart, true);
                    }
                }
            }
        };
        xhr.open("GET", "http://erozate.iutbayonne.univ-pau.fr/Nhan/windapi/php/department_of_town.php?place=" + this.source.entity, false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        xhr.send(null);
    }

    this.result = annot;
    return annot;
};

WIND.ExternalReaction = function (annot, func, params) {
    this.annotationApplied = annot;
    this.effect_type = func;
    if (params instanceof Array)
        this.parameters = params;
    else
        this.parameters = [params];
};
WIND.ExternalReaction.prototype = new WIND.SystemReaction();

// Representation class
WIND.Representation = function (type, annot, component) {
    if (type == component.type) {
        this.type = type;
        this.annotation = annot;
        this.parentComponent = component;
        annot.contains.push(this);
    }
};

WIND.GUI = function (iddiv, options) {
    this.container = iddiv;
    this.viewers = [];
    this.nbViewers = 0;

    this.author = null;
    this.title = null;
    this.description = null;
    if (options) {
        if (options.author) this.author = options.author;
        if (options.title) this.title = options.title;
        if (options.description) this.description = options.description;
    }
    this.reactions = [];
    this.interactions = [];

    var docDiv;
    if (document.getElementById(iddiv))
        docDiv = document.getElementById(iddiv);
    else {
        docDiv = document.createElement("div");
        docDiv.id = iddiv;
    }
    if (this.title) {
        var div = document.createElement("div");
        div.id = this.container + "-applicationTitle";
        div.style.position = "absolute";
        div.style.left = "10px";
        div.style.top = "3px";
        var p = document.createElement("p");
        p.style.color = "#3366CC";
        p.style.fontWeight = "bold";
        p.style.fontSize = "20px";
        p.innerHTML = this.title;
        div.appendChild(p);
        var p = document.createElement("p");
        p.style.fontSize = "15px";
        p.innerHTML = this.description;
        div.appendChild(p);
        docDiv.appendChild(div);

        var div = document.createElement("div");
        div.id = this.container + "-applicationFooter";
        div.style.position = "absolute";
        div.style.left = "10px";
        div.style.bottom = "3px";
        var p = document.createElement("p");
        p.style.fontSize = "9px";
        p.style.fontStyle = "italic";
        if (this.author == null)
            p.innerHTML = "This application is designed using WINDMash.";
        else
            p.innerHTML = "This application is designed by " + this.author /*+ " using WINDMash."*/ ;
        div.appendChild(p);
        docDiv.appendChild(div);
    }
};
WIND.GUI.prototype.createInteraction = function (part, str, reacts) {
    var i = new WIND.Interaction(part, str, reacts);
    i.id = this.container + "_interaction" + (this.interactions.length + 1);
    this.interactions.push(i);
    return i;
};

WIND.GUI.prototype.createReaction = function (part, func, params) {
    var r = new WIND.Reaction(part, func, params);
    if (r instanceof Array) {
        for (var i = 0; i < r.length; i++) {
            r[i].id = this.container + "_reaction" + (this.reactions.length + 1);
            this.reactions.push(r[i]);
        }
    } else {
        r.id = this.container + "_reaction" + (this.reactions.length + 1);
        this.reactions.push(r);
    }
    return r;
};


// SensiblePart class
WIND.SensiblePart = function (type) {
    this.type = type;
    this.viewer = null;
};
WIND.SensiblePart.prototype.callFunction = function (func, params) {
    // Les fonctions de WIND.Text.Part
    if (this.type == "text" || this.type == "list") {
        if (func == "highlight") {
            this.highlight();
        } else if (func == "bold") {
            this.bold();
        } else if (func == "italicize") {
            this.italicize();
        } else if (func == "underline") {
            this.underline();
        } else if (func == "blink") {
            this.blink();
        } else if (func == "setStyleByClass") {
            //var name = func.substring(16, func.length);
            var param = params[0];
            this.setStyleByClass(param);
        } else if (func == "setStyle") {
            var param = params[0];
            this.setStyle(param);
        } else if (func == "show") {
            this.show();
        }
        if (func == "hide") {
            this.hide();
        }
        if (func == "setDraggable") {
            var param = params[0];
            var param1 = params[1];
            this.setDraggable(param, param1);
        }
    }
    // Les fonctions de WIND.Map.Part
    else if (this.type == "map") {
        if (func == "zoom") {
            this.zoomTo();
        }
        if (func == "zoomWith") {
            this.zoomWith(params[0]);
        } else if (func == "highlight" && this.viewer.type == "map") {
            this.highlight();
        }
        if (func == "focus") {
            this.highlight();
            this.zoomTo();
        } else if (func == "setFeatureStyle") {
            //var decor = func.substring(15, func.length);
            var decor = params[0];
            this.setFeatureStyle(decor);
        } else if (func == "show") {
            this.show();
        } else if (func == "hide") {
            this.hide();
        }
    }
    // Les fonctions de WIND.Timeline
    else if (this.type == "timeline") {
        if (func == "zoom") {
            this.zoomTo();
        }
        if (func == "focus") {
            this.highlight();
            this.zoomTo();
        }
    }
    // Les fonctions de WIND.Calendar.Part
    else if (this.type == "calendar") {
        if (func == "highlight") {
            this.highlight();
        }
    }
    // Les fonctions de WIND.Photo.Part
    else if (this.type == "photo") {
        if (func == "color") {
            this.color(params[0], params[1]);
        } else if (func == "focus") {
            this.focus();
        } else if (func == "show") {
            this.show();
        } else if (func == "hide") {
            this.hide();
        } else if (func == "move") {
            this.move(params[0], params[1]);
        } else if (func == "showRestPhoto") {
            this.showRestPhoto();
        } else if (func == "hideRestPhoto") {
            this.hideRestPhoto(params[0]);
        }
    }
    // Les fonctions de WIND.Photo
    else if (this.type == "photoviewer") {
        if (func == "switchTo") {
            this.switchTo(params[0]);
        }

    }
    // Les fonctions de WIND.Popup
    else if (this.type == "popup") {
        if (func == "show") {
            this.show();
        } else if (func == "hide") {
            this.hide();
        }
    }
};

WIND.GUI.prototype.createViewer = function (type, options) {
    // fix bug add a displayer after remove a displayer
    this.nbViewers++;
    var vizId = this.container + "_viewer" + this.nbViewers;
    //var vizId = this.container + "_viewer" + (this.viewers.length + 1);
    options.parentEl = this.container;
    if (type == "text") {
        var t = new WIND.Text(vizId, options);
        t.parentDocument = this;
        this.viewers.push(t);
        return t;
    } else if (type == "map") {
        var m = new WIND.Map(vizId, options);
        m.parentDocument = this;
        this.viewers.push(m);
        return m;
    } else if (type == "calendar") {
        var c = new WIND.Calendar(vizId, options);
        c.parentDocument = this;
        this.viewers.push(c);
        return c;
    } else if (type == "timeline") {
        var ti = new WIND.Timeline(vizId, options);
        ti.parentDocument = this;
        this.viewers.push(ti);
        return ti;
    } else if (type == "list") {
        var l = new WIND.List(vizId, options);
        l.parentDocument = this;
        this.viewers.push(l);
        return l;
    } else if (type == "photo") {
        var p = new WIND.Photo(vizId, options);
        p.parentDocument = this;
        this.viewers.push(p);
        return p;
    } else if (type == "video") {
        var v = new WIND.Video(vizId, options);
        v.parentDocument = this;
        this.viewers.push(v);
        return v;
    }
    return null;
};
WIND.GUI.prototype.getValue = function () {
    var viewerModules = [];
    for (var i = 0; i < this.viewers.length; i++) {
        viewerModules.push(this.viewers[i].getValue());
    }
    return {
        id: this.container,
        rdftype: "http://erozate.iutbayonne.univ-pau.fr/wind#GUI",
        author: this.author,
        title: this.title,
        description: (this.description) ? (this.description) : "",
        contain: viewerModules
    }
};

WIND.LiveSensiblePart = function (afficheur, func) {
    this.viewer = afficheur;
    this.func = func;
};
WIND.Annotation = function (type, entity, sp) {
    this.semantics = type;
    this.entity = entity;
    if (sp == null) {
        this.annotedObjects = new Array();
    } else {
        if (sp instanceof Array) {
            this.annotedObjects = sp;
            for (var i = 0; i < sp.length; i++) {
                sp[i].annotation = this;
            }
        } else {
            this.annotedObjects = [sp];
            sp.annotation = this;
        }
    }
    this.contains = new Array();
};
WIND.Annotation.prototype.addSensiblePart = function (sp) {
    this.annotedObjects.push(sp);
    sp.annotation = this;
};

WIND.Selection = function (tab) {
    this.set = tab;
    this.result = null;
};
WIND.Selection.prototype.raise = function () {
    return this.result;
};

// Popup class
WIND.Popup = function (x, y, div) {
    this.x = x;
    this.y = y;
    this.container = div;
    var closeDiv = document.createElement('div');
    closeDiv.style.textAlign = 'right';
    closeDiv.innerHTML = "<img src='close.gif' onclick='document.getElementById(\"" + div + "\").style.visibility = \"hidden\";'>";
    document.getElementById(this.container).appendChild(closeDiv);
    this.content = '';
    this.hide();
};
WIND.Popup.prototype = new WIND.SensiblePart('popup', this.container);
WIND.Popup.prototype.setContent = function (text) {
    this.content = text;
    var textDiv = document.createElement('div');
    textDiv.id = this.container + 'Content';
    textDiv.style.padding = '10px';
    textDiv.innerHTML = text;
    document.getElementById(this.container).appendChild(textDiv);
};
WIND.Popup.prototype.getContent = function () {
    return this.content;
};
WIND.Popup.prototype.createSensiblePart = function (exp) {
    var t = this.content;
    var pivot = 0;
    var pos;
    var postab = [];
    if (t.startsWith(exp)) postab.push(0);
    while (pivot < t.length && pivot != -1) {
        pos = t.indexOf(exp, pivot + 1);
        pivot = pos;
        if (pivot != -1) postab.push(pivot);
    }
    var newstr = "";
    var debut = 0;
    var fin;
    for (var i = 0; i < postab.length; i++) {
        fin = postab[i];
        newstr += t.substring(debut, fin) + "<span id='" + exp.trim() + i + "'>" + exp + "</span>";
        debut = fin + exp.length;
    }
    newstr += t.substring(debut, t.length);
    document.getElementById(this.container + 'Content').innerHTML = newstr;
    this.content = newstr;
    var textparts = [];
    for (var i = 0; i < postab.length; i++) {
        textparts.push(new WIND.TextPart(exp.trim() + i));
    }
    return textparts;
};
WIND.Popup.prototype.createSensiblePartById = function (id) {
    return new WIND.TextPart(id);
};
WIND.Popup.prototype.show = function () {
    document.getElementById(this.container).style.position = 'absolute';
    document.getElementById(this.container).style.left = this.x;
    document.getElementById(this.container).style.top = this.y;
    document.getElementById(this.container).style.border = "1px #0033CC solid";
    document.getElementById(this.container).style.backgroundColor = '#BFCFFE';
    document.getElementById(this.container).style.opacity = 0.8;
    document.getElementById(this.container).style.visibility = 'visible';
};
WIND.Popup.prototype.hide = function () {
    document.getElementById(this.container).style.visibility = 'hidden';
};

// Create AJAX object
createXHR = function () {
    var request = null;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }
    return request;
};

/*loadJS = function(url, callback) {
	var added = false;
	var heads = document.getElementsByTagName('head');
	var scripts = document.getElementsByTagName('script');
	if (heads.length > 0) {
		var head = heads[0]; 
		for (var i=0; i<scripts.length; i++) {
			if (scripts[i].src == url) {
				added = true;
				break;
			}
		}
	}

	var script = document.createElement('script');
	script.src = url;
	
	if (added) {
		callback();
	}
	else {
		if (heads.length > 0) {
			var head = heads[0]; 
			head.appendChild(script);
		} else {
			var head = document.createElement('head');    
			head.appendChild(script);
			document.body.parentNode.appendChild(head);
		}

		// most browsers
		script.onload = callback;  

		// IE 6 & 7
		script.onreadystatechange = function() {
			if (script.readyState == 'loaded' || script.readyState == 'complete') {
				callback();
			//console.log(url + ' is loaded, state= ' + script.readyState);
			}
		};
	}
};

removeJS = function(url) {
	var heads = document.getElementsByTagName('head');
	var scripts = document.getElementsByTagName('script');
	if (heads.length > 0) {
		var head = heads[0]; 
		for (var i=0; i<scripts.length; i++) {
			if (scripts[i].src == url) {
				head.removeChild(scripts[i]);
			}
		}
	}
};
// Restart div
restartDiv = function(divId) {
	var removedDiv = document.getElementById(divId);
	var sty = removedDiv.className;
	document.body.removeChild(removedDiv);
	var newDiv = document.createElement('div'); 
	newDiv.id = divId + "n";
	newDiv.className = sty;
	document.body.appendChild(newDiv);
};
*/
// This method fixes IE specific issues 
fixIE = function () {
    if (!Array.indexOf) {
        Array.prototype.indexOf = function (arg) {
            var index = -1;
            for (var i = 0; i < this.length; i++) {
                var value = this[i];
                if (value == arg) {
                    index = i;
                    break;
                }
            }
            return index;
        }
    }

    if (!window.console) {

        window.console = {};
        window.console.log = function (message) {
            var body = document.getElementsByTagName('body')[0];
            var messageDiv = document.createElement('div');
            messageDiv.innerHTML = message;
            body.insertBefore(messageDiv, body.lastChild);
        }
    }
};
String.prototype.startsWith = function (str) {
    return (this.length != 0 && this.indexOf(str) == 0);
};
String.prototype.endsWith = function (str) {
    return (this.length != 0 && this.lastIndexOf(str) == (this.length - str.length));
};
String.prototype.trim = function () {
    return this.replace(/\s+/g, '');
};
padZero = function (number) {
    if (number < 10) {
        number = 0 + '' + number;
    }
    return number;
};

WIND.getScriptLocation = function () {
    var scriptLocation = "";
    var isOL = new RegExp("(^|(.*?\\/))(WIND_v2.0.js)(\\?|$)");
    var scripts = document.getElementsByTagName('script');
    for (var i = 0, len = scripts.length; i < len; i++) {
        var src = scripts[i].getAttribute('src');
        if (src) {
            var match = src.match(isOL);
            if (match) {
                scriptLocation = match[1];
                break;
            }
        }
    }
    return scriptLocation;
};