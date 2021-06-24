import React, {useLayoutEffect} from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import sales from "../sales.json";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);
const StackedArea = () => {

    useLayoutEffect(() => {
        
        let chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = sales;
        chart.numberFormatter.numberFormat = "#,##a";
        chart.dateFormatter.dateFormat = "M/d/yyyy";
    
        // Add data pre-processor
        chart.events.on("beforedatavalidated", function(ev) {
            chart.data.sort(function(a, b) {
                return (a.period) - (b.period);
            });
            let source = ev.target.data;
            let dates = {};
            let data = [];
            for(let i = 0; i < source.length; i++) {
                let row = source[i];
                if (dates[row.period] == undefined) {
                    dates[row.period] = {
                        date: row.period,
                        market: row.market
                    };
                    data.push(dates[row.period]);
                }
                dates[row.period][source[i].channel] =row.sales;  
            }
            chart.data = data;
        });


        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.startLocation = 0.5;
        dateAxis.endLocation = 0.5;
        dateAxis.dateFormats.setKey("day", "M/d/yyyy");
        dateAxis.renderer.minGridDistance = 30;
    
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.name = "In store";
        series.dataFields.valueY = "In Store";
        series.tooltipText = "[#fff]{name}: ${valueY.value}";
        series.tooltip.getFillFromObject = true;
        series.tooltip.getStrokeFromObject = true;
        series.fillOpacity = 0.7;
        series.fill = am4core.color("#54A3CD");
        series.defaultState.transitionDuration = 1000;
        series.stacked = true; // remove to get unstacked chart
        series.sequencedInterpolation = true;
  
        
        let series2 = chart.series.push(new am4charts.LineSeries());
        series2.name = "Order Ahead";
        series2.dataFields.dateX = "date";
        series2.dataFields.valueY = "Order Ahead";
        series2.tooltipText = "[#fff]{name}:${valueY}[/]";
        series2.tooltip.getFillFromObject = true;
        series2.tooltip.getStrokeFromObject = true;
        series2.fillOpacity = 0.7;
        series2.fill = am4core.color("#C31F46");
        series2.stacked = true;
        series2.defaultState.transitionDuration = 1000;
        
        let series3 = chart.series.push(new am4charts.LineSeries());
        series3.name = "Delivery";
        series3.dataFields.dateX = "date";
        series3.dataFields.valueY = "Delivery";
        series3.tooltipText = "[#fff]{name}:${valueY.value}[/]";
        series3.tooltip.getFillFromObject = true;
        series3.tooltip.getStrokeFromObject = true;
        series3.fillOpacity = 0.7;
        series3.defaultState.transitionDuration = 1000;
        series3.fill = am4core.color("#636568");
        series3.stacked = true;
        
        
        /* Decorate axis tooltip content */
        let axisTooltip = dateAxis.tooltip;
        axisTooltip.background.fill = am4core.color("#636568");
        axisTooltip.background.strokeWidth = 0;
       
       
        let axisTooltipValue= valueAxis.tooltip;
        axisTooltipValue.background.fill = am4core.color("#636568");
        axisTooltipValue.background.strokeWidth = 0;
        

        chart.scrollbarX = new am4core.Scrollbar();
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;


        // Add a legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "top";

        // Add a title => market is same for all data so I'm taking first
        let title = chart.titles.create();
        title.text = `Sales Forecast in ${chart.data[0].market} Market`;
        title.fontSize = 25;
        title.marginBottom = 30;
 
    
        // Add zoom in and zoom out button on chart
        let buttonContainer = chart.plotContainer.createChild(am4core.Container);
        buttonContainer.shouldClone = false;
        buttonContainer.align = "right";
        buttonContainer.valign = "top";
        buttonContainer.zIndex = Number.MAX_SAFE_INTEGER;
        buttonContainer.marginTop = 5;
        buttonContainer.marginRight = 5;
        buttonContainer.layout = "horizontal";

        let zoomInButton = buttonContainer.createChild(am4core.Button);
        zoomInButton.label.text = "+";
        zoomInButton.events.on("hit", function() {
            let diff = dateAxis.maxZoomed - dateAxis.minZoomed;
            let delta = diff * 0.2;
            dateAxis.zoomToDates(new Date(dateAxis.minZoomed + delta), new Date(dateAxis.maxZoomed - delta));
        });

        let zoomOutButton = buttonContainer.createChild(am4core.Button);
        zoomOutButton.label.text = "-";
        zoomOutButton.events.on("hit", function() {
            let diff = dateAxis.maxZoomed - dateAxis.minZoomed;
            let delta = diff * 0.2;
            dateAxis.zoomToDates(new Date(dateAxis.minZoomed - delta), new Date(dateAxis.maxZoomed + delta));
        });

        return () => {
            chart.dispose();
        };
    }, []);

    return (
        <div>
            <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
        </div>
    );
};
export default StackedArea;