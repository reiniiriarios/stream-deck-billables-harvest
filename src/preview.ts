import { pieChartOnlyPreview, pieChartPreview, timerPreview } from './display';

const pieChartImg = document.getElementById('pie-chart') as HTMLImageElement;
const timerOnImg = document.getElementById('timer-on') as HTMLImageElement;
const timerOffImg = document.getElementById('timer-off') as HTMLImageElement;
const pieChartOnlyImg = document.getElementById('pie-chart-only') as HTMLImageElement;

pieChartImg.src = pieChartPreview(2.15, 6);
timerOnImg.src = timerPreview(0.75, true, 'Proj Dev');
timerOffImg.src = timerPreview(1.25, false, 'Articles');
pieChartOnlyImg.src = pieChartOnlyPreview(2.15, 6);
