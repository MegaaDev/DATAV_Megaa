import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Chart = ({ dataTime, dataTemp }) => {
  const tempRef = useRef();

  useEffect(() => {
    const chartHolder = d3.select(tempRef.current);

    chartHolder.selectAll("*").remove();

    const width = 1200;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const parsedTimeData = dataTime.map((timeString) => new Date(timeString));

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(parsedTimeData))
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(dataTemp), d3.max(dataTemp)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const dataObject = parsedTimeData.map((time, index) => ({
      time: time,
      temperature: dataTemp[index],
    }));

    // const line = d3
    //   .line()
    //   .x((d) => xScale(d.time))
    //   .y((d) => yScale(d.temperature));
    const line = d3
      .line()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.temperature))
      .defined((d) => !isNaN(d.temperature));

    chartHolder
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(20))
      .selectAll("text")
      .style("fill", "white");

    chartHolder
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("fill", "white");
    chartHolder.select(".domain").style("stroke", "green");
    chartHolder.selectAll(".tick line").style("stroke", "white");
    chartHolder
      .selectAll(".domain")
      .filter((d, i, nodes) => i === nodes.length - 1)
      .style("stroke", "green");
    chartHolder.select(".y-axis .domain").style("stroke", "white");
    chartHolder
      .append("text")
      .attr("x", width / 2)
      .attr("y", height)
      .attr("text-anchor", "middle")
      .style("fill", "grey")
      .text("Time");

    chartHolder
      .append("text")
      .attr("x", -height / 2)
      .attr("y", margin.left / 3)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .style("fill", "grey")
      .text("Temperature(°C)");
    chartHolder
      .append("path")
      .datum(dataObject)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [dataTime, dataTemp]);

  return <svg width={1200} height={500} ref={tempRef}></svg>;
};

export default Chart;
