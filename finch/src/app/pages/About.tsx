import { useNavigate } from "react-router";

import Paper from "@/components/Paper";
import PlotlyScatter from "@/components/PlotlyScatter";
import SignalMonitorPlot from "@/components/SignalMonitorPlot";
import Plot, { PlotParams } from 'react-plotly.js';
import CSIController from "@/components/ADLController/CSIController";


export default function About() {

    const navigate = useNavigate();
    const data: PlotParams["data"] = [{
        x: [1, 2, 3],
        y: [2, 6, 3],
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'red' },
    }];

    return (
     
            <CSIController/>
    )
}