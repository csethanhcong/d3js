import Chart from './C9.Chart';

import Axis from './utils/C9.Axis';
import Title from './utils/C9.Title';
import Legend from './utils/C9.Legend';
import Table from './utils/C9.Table';
import Tooltip from './utils/C9.Tooltip';

import Helper from '../helper/C9.Helper';
import DataAdapter from '../helper/C9.DataAdapter';

export default class DonutChart extends Chart {
    constructor(options) {
        super(options);

        var self = this;

        var R = Math.min(self.width - self.margin.left - self.margin.right, self.height - self.margin.top - self.margin.bottom) / 2;
        self.config = {
            outerRadius: R,
            innerRadius: R > 80 ? R - 80 : R - 40,
            // showText: true // show/hide text on middle or each donut
        };

        // self.updateConfig(config);
    }

    /*==============================
    =            Getter            =
    ==============================*/
    get pie() {
        return this._pie;
    }

    get arc() {
        return this._arc;
    }

    get currentData() {
        return this._currentData;
    }
    /*=====  End of Getter  ======*/

    /*==============================
    =            Setter            =
    ==============================*/
    set pie(arg) {
        if (arg) {
            this._pie = arg;
        }
    }

    set arc(arg) {
        if (arg) {
            this._arc = arg;
        }
    }

    set currentData(arg) {
        if (arg) {
            this._currentData = arg;
        }
    }
    /*=====  End of Setter  ======*/
    
    /*======================================
    =            Main Functions            =
    ======================================*/
    /**
     * Update Donut Chart Config
     */
    updateConfig(config, callback) {
        super.updateConfig(config);

        var self = this;

        self.options = Helper.mergeDeep(config, self.options);

        self.chartType      = 'donut';

        var dataOption          = self.dataOption;
        dataOption.colorRange   = self.colorRange;

        var da = new DataAdapter(dataOption, self.chartType, null);
        da.getDataTarget(self.chartType, function(data) {
            self.dataTarget = data;
            
            if (Helper.isFunction(callback)) {
                callback.call(self, self.dataTarget);
            }
        });
    }

    /**
     * Update Donut Chart Config
     */
    updateDataConfig(dataCfg, callback) {
        var self = this;

        self.options = Helper.mergeDeep(self.options, dataCfg);

        self.chartType      = 'donut';

        var dataOption          = self.dataOption;
        dataOption.colorRange   = self.colorRange;

        var da = new DataAdapter(dataOption, self.chartType, null);
        da.getDataTarget(self.chartType, function(data) {
            self.dataTarget = data;
            
            if (Helper.isFunction(callback)) {
                callback.call(self, self.dataTarget);
            }
        });
    }

    /**
     * Update Donut Chart based on new data
     * @param  {[type]} data [description]
     */
    update(data) {
        var self = this;

        var width   = self.width - self.margin.left - self.margin.right,
            height  = self.height - self.margin.top - self.margin.bottom,
            color   = self.colorRange;

        self.arc = d3.svg.arc()
                    .outerRadius(self.options.outerRadius)
                    .innerRadius(self.options.innerRadius);

        //we can sort data here
        self.pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) { return d.value; });

        self.body.selectAll(".c9-chart-donut.c9-custom-arc-container").data([]).exit().remove();

        //draw chart
        var arcs = self.body
                    .append('g')
                        .attr('class', 'c9-chart-donut c9-custom-arc-container')
                        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')
                        .selectAll('.c9-chart-donut.c9-custom-arc')
                        .data(self.pie(data)).enter()
                        .append('g')
                            .attr('class', 'c9-chart-donut c9-custom-arc');

        // Append main path contains donut
        // TODO: add a unique class to allow Legend could find selected donut/pie
        arcs.append('path')
                .attr('class', 'c9-chart-donut c9-custom-path')
                .attr('data-ref', function(d) { return d.data['data-ref']; })
                .attr('d', self.arc)
                .attr('fill', function(d, i) { return color(i); })
                .attr('stroke', '#ffffff')
                .each(function(d) { self.currentData = d; }); 
                // Current data used for calculate interpolation 
                // between current arc vs disabled arc


        // Append middle text display name
        // if (self.showText) {
        //     arcs.append('text')
        //             .attr('class', 'c9-chart-donut c9-custom-text')
        //             .attr('transform', function(d) { return 'translate(' + self.arc.centroid(d) + ')'; })
        //             .attr('dy', '.35em')
        //             .attr('text-anchor', 'middle')
        //             .text(function(d) { return d.data.name; });
        // }
        
        self.updateInteraction();
    }

    /**
     * Select all path as type PATH in Donut Chart via its CLASS
     */
    selectAllPath() {
        var self = this;

        return self.body
                // .selectAll('g')
                    .selectAll('path.c9-chart-donut.c9-custom-path');
    }

    /**
     * Update Interaction: Hover
     * @return {} 
     */
    updateInteraction() {
        var self    = this,
            selector= self.selectAllPath(),
            width   = self.width - self.margin.left - self.margin.right,
            height  = self.height - self.margin.top - self.margin.bottom,
            color   = self.colorRange,
            chartInnerBefore = self.options.innerRadius,
            chartOuterBefore = self.options.outerRadius,
            chartInnerAfter = self.options.innerRadius,
            chartOuterAfter = self.options.outerRadius * 1.2;

        var hoverOptions        = self.hover.options,
            hoverEnable         = self.hover.enable,
            onMouseOverCallback = hoverOptions.onMouseOver.callback,
            onMouseOutCallback  = hoverOptions.onMouseOut.callback,
            onClickCallback  = self.click.callback;

        var tooltip = new Tooltip(self.options.tooltip);

        // Main Event Dispatch for paths in donut chart
        self._eventFactory = {
            'click': function(d, i) {
                if (Helper.isFunction(onClickCallback)) {
                    onClickCallback.call(this, d);
                }
            },

            'mouseover': function(d, i) {
                if (!hoverEnable) return;

                if (Helper.isFunction(onMouseOverCallback)) {
                    onMouseOverCallback.call(this, d);
                }

                var selector = d3.select(this);
                selector.transition()
                        .attr('d', d3.svg.arc()
                            .innerRadius(chartInnerAfter)
                            .outerRadius(chartOuterAfter)
                        );

                // For legend
                if (self.options.legend.show)
                    self.legend.item.each(function() {
                        if (d3.select(this).attr('data-ref') !== d.data['data-ref'] && d3.select(this).attr('data-enable') == 'true') {
                            d3.select(this).attr('opacity', '0.3');
                        }
                    });

                // For Table
                if (self.options.table.show) {
                    var tr = d3.selectAll('.c9-table-container>.c9-table-body tr');
                    tr.filter(function(i) { return i['data-ref'] != d.data['data-ref'] }).selectAll('td').style('opacity', '0.5');
                    var selectedItem = tr.filter(function(i) { return i['data-ref'] == d.data['data-ref'] });
                    //set its style and scroll to its pos
                    selectedItem.selectAll('td').style('opacity', '1');
                    Helper.scroll(d3.select('.c9-table-container')[0][0], selectedItem[0][0].offsetTop, 200);
                }

                // For Chart
                self.selectAllPath().each(function(){
                    if (d3.select(this).attr('data-ref') !== d.data['data-ref']) {
                        d3.select(this).attr('opacity', '0.3');
                    }
                });

                // For Tooltip
                tooltip.draw(d, self, 'mouseover');
            },
            
            'mouseout': function(d, i) {
                if (!hoverEnable) return;

                if (Helper.isFunction(onMouseOutCallback)) {
                    onMouseOutCallback.call(this, d);
                }

                var selector = d3.select(this);
                selector.transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('d', d3.svg.arc()
                            .innerRadius(chartInnerBefore)
                            .outerRadius(chartOuterBefore)
                        );

                // For legend
                if (self.options.legend.show)
                self.legend.item.each(function() {
                    if (d3.select(this).attr('data-ref') !== d.data['data-ref'] && d3.select(this).attr('data-enable') == 'true') {
                        d3.select(this).attr('opacity', '1.0');
                    }
                });

                // For Table
                if (self.options.table.show)
                    d3.selectAll('.c9-table-container>.c9-table-body tr').selectAll('td').style('opacity', '');
                
                // For Chart
                self.selectAllPath().each(function(){
                    if (d3.select(this).attr('data-ref') !== d.data['data-ref']) {
                        d3.select(this).attr('opacity', '1.0');
                    }
                });

                // For Tooltip
                tooltip.draw(d, self, 'mouseout');
            }

        };

        selector.on(self._eventFactory);
    }
    
    /*=====  End of Main Functions  ======*/
    
    /*========================================
    =            User's Functions            =
    ========================================*/
    /**
     * Custom Event Listener
     * @param  {[type]}   eventType [description]
     * @param  {Function} callback  [description]
     * @return {[type]}             [description]
     */
    on(eventType, callback) {
        super.on(eventType, callback);
        
        var self = this;
        var selector    = self.selectAllPath();

        // Update Event Factory
        let eventFactory = {
            'click.event': function(d) {
                if (Helper.isFunction(callback)) {
                    callback.call(this, d);
                }
            },
            'mouseover.event': function(d) {
                if (Helper.isFunction(callback)) {
                    callback.call(this, d);
                }
            },
            'mouseout.event': function(d) {
                if (Helper.isFunction(callback)) {
                    callback.call(this, d);
                }
            }
        }

        let eventName = eventType + '.event';

        selector.on(eventName, eventFactory[eventName]);
    }

    /**
     * Main draw function of Donut Chart
     */
    draw() {
        super.draw();

        var self = this;
        
        self.updateConfig(self.config, function(data) {
            var title   = new Title(self.options.title, self);
            var legend  = new Legend(self.options.legend, self, self.dataTarget);
            var table   = new Table(self.options.table, self, self.dataTarget);

            self.title = title;
            self.legend = legend;
            self.table = table;

            // Draw title
            self.title.draw();

            // Update interaction of this own chart
            self.update(self.dataTarget);
            self.updateInteraction();

            self.legend = legend;
            self.table = table;

            // Draw legend
            self.legend.draw();
            self.legend.updateInteractionForDonutPieChart(self, self.selectAllPath(), self.pie, self.currentData, self.arc);

            // Draw table
            self.table.draw();
            self.table.updateInteractionForDonutPieChart(self);
        });
    }
    
    /**
     * Set option via stand-alone function
     * @param {[type]} key   [description]
     * @param {[type]} value [description]
     */
    setOption(key, value) {
        super.setOption(key, value);

        var self = this;

        Helper.set(key, value, self.options);

        self.updateConfig(self.options);
    }

    /**
     * Update chart based on new data with optional dataConfig
     * @param  {[type]} data       [description]
     * @param  {[type]} dataConfig [description]
     */
    updateData(newData, newDataConfig) {
        var self = this;

        var newCfg = {};

        if (!Helper.isEmpty(newDataConfig)) {

            newCfg.data = {
                plain: newData,
                keys: newDataConfig,
            };

        } else {

            newCfg.data = {
                plain: newData,
            };

        }
        
        self.updateDataConfig(newCfg, function(data) {
            // Update Chart
            self.update(data);

            // Update Legend
            self.legend.update(data);
            self.legend.updateInteractionForDonutPieChart(self, self.selectAllPath(), self.pie, self.currentData, self.arc);    
        
            // Update Table
            self.table.update(data);
            self.table.updateInteractionForDonutPieChart(self);
        });
    }
    
    
    /*=====  End of User's Functions  ======*/
    
    
}
