'use strict';

class LineChart extends Chart {
    constructor(options) {
        super(options);
        var config = {
            point_show: true,
            point_radius: 5,
            line_color: "black",
            point_hover_enable: true
        };

        this._pointShow         = options.point_show            ||  config.point_show;
        this._pointRadius       = options.point_radius          ||  config.point_radius;
        this._lineColor         = options.line_color            ||  config.line_color;
        this._pointHoverEnable  = options.point_hover_enable    ||  config.point_hover_enable;

        // Data format:[
        // { name, 
        //   coordinate: [
        //   {
        //      x, y
        //   }
        //  ]
        // }
        //] 
        // Sort coordinate accesding after coor.x


        var _currentDataY = this.data;
        _currentDataY.forEach(function(_currentValue,_index,_arr) {
                                    _currentDataY[_index].coordinate.sort(function(a,b) {
                                        return (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0);
                                    });
                                });
        this.sortedDataY         = _currentDataY;

        // Get maximum value of coordinate {x, y}
        var tempMaxY = [];

        for (var i=0; i<this.sortedDataY.length; i++) {
            tempMaxY[i] = this.sortedDataY[i].coordinate[this.sortedDataY[i].coordinate.length - 1].y;
        }

        var _maxY = Math.max(...tempMaxY);

        
        var _currentDataX = this.data;
        _currentDataX.forEach(function(currentValue,index,arr) {
                                    _currentDataX[index].coordinate.sort(function(a,b) {
                                        return (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0);
                                    });
                                });
        this.sortedDataX         = _currentDataX;
        var tempMaxX = [];
        for (var i=0; i<this.sortedDataX.length; i++) {
            tempMaxX[i] = this.sortedDataX[i].coordinate[this.sortedDataX[i].coordinate.length - 1].x;
        }
        var _maxX = Math.max(...tempMaxX);

        // .1 to make outerPadding, according to: https://github.com/d3/d3/wiki/Ordinal-Scales
        var width   = this.width - this.margin.left - this.margin.right;
        var height  = this.height - this.margin.top - this.margin.bottom;

        var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        x.domain([_maxX, 0]);
        y.domain([_maxY, 0]);

        var lineFunc = d3.svg.line()
            .x(function(d, i) { return x(d.x); })
            .y(function(d, i) { return y(d.y); })
            .interpolate("linear");

        this.svg.selectAll('g')
                .data(this.sortedDataX)
                .enter()
                .append('path')
                // .attr('class', 'line')
                .attr('d', function(d){
                    console.log(lineFunc(d.coordinate));
                    return lineFunc(d.coordinate);
                })
                .attr('stroke', 'green')
                .attr('stroke-width', 2)
                .attr('fill', 'none');
    }

    /*==============================
    =            Getter            =
    ==============================*/
    
    /*=====  End of Getter  ======*/

    /*==============================
    =            Setter            =
    ==============================*/
    /*=====  End of Setter  ======*/
    
    /*======================================
    =            Main Functions            =
    ======================================*/

    draw() {
        var axis    = new Axis(this.options, this.svg, this.data, this.width - this.margin.left - this.margin.right, this.height - this.margin.top - this.margin.bottom);
        var title   = new Title(this.options, this.svg, this.width, this.height, this.margin);
        
    }
    
    /*=====  End of Main Functions  ======*/
    
    
}

