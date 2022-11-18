import { useState, useEffect, useContext } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import getDataDolar from "../services/getDataDolar";
import { deviation, mean } from "d3";
import "./RenderChart.css";
import { ChartContext } from "../ChartContext";

function RenderChart() {
  const [dolar, setDolar] = useState([]);
  const [prediction, setPrediction] = useState(false);
  const [prueba, setPrueba] = useState([]);
  const [dates, setDates] = useState([]);
  const [dolarActual, setDolarActual] = useState([]);
  const { left, right, range, conservador } = useContext(ChartContext);

  let contador = 0;
  let latestYear = 0;
  let stockDayPcntChange = [];
  let predictionDolar = [];

  let meanDailyChange = 0;
  let stdDevDailyChange = 0;

  useEffect(() => {
    contador = 0;
    const predictionAux = JSON.parse(localStorage.getItem("prediction"));
    const dateAux = JSON.parse(localStorage.getItem("dates"));
    const dolarAux = JSON.parse(localStorage.getItem("dolaractual"));

    if (predictionAux) {
      setPrueba(predictionAux);
    }
    if (dateAux) {
      setDates(dateAux);
    }
    if (dolarAux) {
      setDolarActual(dolarAux);
    }
    getDataDolar(range)
      .then((response) => {
        setDolar(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [range]);

  //Función necesarias para el formateo de fechas

  const getMonthFormat = (month) => {
    switch (month) {
      case "01":
        month = "Enero";
        break;
      case "02":
        month = "Febrero";
        break;
      case "03":
        month = "Marzo";
        break;
      case "04":
        month = "Abril";
        break;
      case "05":
        month = "Mayo";
        break;
      case "06":
        month = "Junio";
        break;
      case "07":
        month = "Julio";
        break;
      case "08":
        month = "Agosto";
        break;
      case "09":
        month = "Septiembre";
        break;
      case "10":
        month = "Octubre";
        break;
      case "11":
        month = "Noviembre";
        break;
      case "12":
        month = "Diciembre";
        break;
      default:
        break;
    }
    return month;
  };

  const formatDate = (data, type) => {
    let month;
    let day;
    let year;
    if (type === "historical") {
      month = String(data.vigenciadesde.slice(5, 7));
      day = String(data.vigenciadesde.slice(8, 10));
      year = data.vigenciadesde.slice(0, 4);
    }
    if (type === "historical") {
      month = getMonthFormat(month);
      let dateFormat = day + " " + month + " " + year;
      return dateFormat;
    } else {
      month = getMonthFormat(data);
      return month;
    }
  };

  // Se realiza el modelo de la predicción del dolar

  const getNewDates = (data) => {
    let newDate = data;
    let fullDay = newDate.toString().slice(7, 10);
    let fullMonth = String(newDate.getMonth() + 1);
    let fullYear = String(newDate.getFullYear());
    let formatMonth = formatDate(fullMonth, "prediction");
    let concat = fullDay + " " + formatMonth + " " + fullYear;
    exactDate.push(concat);
  };

  function projectStockPrice(currPrice, meanDailyChange, stdDevDailyChange) {
    const drift = meanDailyChange - (stdDevDailyChange * stdDevDailyChange) / 2;
    let number = Math.random();
    const randomShock = stdDevDailyChange * NormSInv(number);
    return currPrice * Math.exp(drift + randomShock);
  }

  const modeloMonteCarlo = () => {
    for (let i = 1; i < dolar.length; i++) {
      const curDayPrice = dolar[i].valor;
      const prevDayPrice = dolar[i - 1].valor;
      stockDayPcntChange.push((curDayPrice - prevDayPrice) / prevDayPrice);
    }

    // Precio donde se empieza la predicción historica
    meanDailyChange = mean(stockDayPcntChange);
    stdDevDailyChange = deviation(stockDayPcntChange);
    const firstPrice = projectStockPrice(
      valorDolar[0],
      meanDailyChange,
      stdDevDailyChange
    );
    predictionDolar.push(firstPrice);

    

    for (let index = 1; index < dolar.length; index++) {
      let price = conservador ? dolar[index - 1].valor : predictionDolar[index-1];
      let aux = projectStockPrice(price, meanDailyChange, stdDevDailyChange);
      predictionDolar.push(aux);
    }


    if (dolar.length > 0 && left === false) {
      let prueba = new Date(dolar[dolar.length - 1].vigenciadesde);
      // Predicción del dolar a futuro
      let futurePrediction = predictionDolar.length;
      for (
        let index = futurePrediction - 1;
        index < futurePrediction + 42;
        index++
      ) {
        prueba.setDate(prueba.getDate() + 1);
        getNewDates(prueba);

        let price = predictionDolar[index - 1];
        valorDolar.push(0);
        let aux = projectStockPrice(price, meanDailyChange, stdDevDailyChange);
        predictionDolar.push(aux);
      }
    }

    if (predictionDolar.length > 1 && left === false) {
      localStorage.setItem("prediction", JSON.stringify(predictionDolar));
      localStorage.setItem("dates", JSON.stringify(exactDate));
      localStorage.setItem("dolarActual", JSON.stringify(valorDolar));
      setPrediction(true);
    }
  };

  // Metodo para sacar la distribución normal estándar inversa de la predicción del dolar
  function NormSInv(p) {
    var a1 = -39.6968302866538,
      a2 = 220.946098424521,
      a3 = -275.928510446969;
    var a4 = 138.357751867269,
      a5 = -30.6647980661472,
      a6 = 2.50662827745924;
    var b1 = -54.4760987982241,
      b2 = 161.585836858041,
      b3 = -155.698979859887;
    var b4 = 66.8013118877197,
      b5 = -13.2806815528857,
      c1 = -7.78489400243029e-3;
    var c2 = -0.322396458041136,
      c3 = -2.40075827716184,
      c4 = -2.54973253934373;
    var c5 = 4.37466414146497,
      c6 = 2.93816398269878,
      d1 = 7.78469570904146e-3;
    var d2 = 0.32246712907004,
      d3 = 2.445134137143,
      d4 = 3.75440866190742;
    var p_low = 0.02425,
      p_high = 1 - p_low;
    var q, r;
    var retVal;

    if (p < 0 || p > 1) {
      alert("NormSInv: Argument out of range.");
      retVal = 0;
    } else if (p < p_low) {
      q = Math.sqrt(-2 * Math.log(p));
      retVal =
        (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    } else if (p <= p_high) {
      q = p - 0.5;
      r = q * q;
      retVal =
        ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
        (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      retVal =
        -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }

    return retVal;
  }

  //Se añaden los valores a data para mostrarlos
  const data = [];

  const predictionAux = JSON.parse(localStorage.getItem("prediction"));
  let valorDolar;
  let exactDate;

  if (predictionAux === null) {
    valorDolar = dolar.map((data) => data.valor);
    exactDate = dolar.map((data) => formatDate(data, "historical"));
    modeloMonteCarlo();
  } else {
    valorDolar = JSON.parse(localStorage.getItem("dolarActual"));
    exactDate = JSON.parse(localStorage.getItem("dates"));
  }

  if (left === true) {
    valorDolar = dolar.map((data) => data.valor);
    exactDate = dolar.map((data) => formatDate(data, "historical"));
    modeloMonteCarlo();
  }

  const year = dolar.map((data) => data.vigenciadesde.slice(0, 4));
  const day = dolar.map((data) => data.vigenciadesde.slice(8, 10));

  for (let i = 0; i < valorDolar.length; i++) {
    let d = {
      exactDate: exactDate,
      Dolar: valorDolar[i],
      Prediccion_dolar:
        predictionAux === null
          ? predictionDolar[i]
          : left === true
          ? predictionDolar[i]
          : prueba[i],
      year: year,
      day: day,
    };
    data.push(d);
  }

  let color = "#00ABB3";

  const renderQuarterTick = (tickProps) => {
    const { x, y, payload } = tickProps;

    const { value, offset } = payload;

    if (value) {
      if (latestYear == 0) {
        latestYear = value;
        return <path d={`M${60},${y}v${-35}`} stroke="black" />;
      }

      contador++;

      // Tener en cuenta esta parte para el responsive
      if (contador == 5) {
        return (
          <text x={x} y={y + 20}>
            {value}
          </text>
        );
      }

      if (latestYear !== value) {
        contador = 0;
        latestYear = value;
        return <path d={`M${x - 15},${y}v${-35}`} stroke="black" />;
      }
    }
  };

  const renderTick = (tickProps) => {
    const { x, y, payload } = tickProps;

    const { value, offset } = payload;

    if (value) {
      let monthValue = value.slice(3, value.length - 5);
      return (
        <text fontSize={12} x={x} y={y + 20} textAnchor="middle">
          {monthValue}
        </text>
      );
    }
  };

  return (
    <ResponsiveContainer width="98%" height="90%">
      <AreaChart
        width={1900}
        height={900}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <button>Hola</button>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={1} />
            <stop offset="95%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f219" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f219" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis xAxisId="0" dataKey="exactDate" tick={renderTick} height={50} />
        <XAxis
          xAxisId="1"
          dataKey="year"
          tick={renderQuarterTick}
          axisLine={false}
          tickLine={false}
        />

        <YAxis tickCount={5} interval="preserveStartEnd" />
        <Tooltip dataKey="exactDate" />
        <Area
          type="monotone"
          dataKey="Dolar"
          stroke={color}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="Prediccion_dolar"
          stroke="#f219"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default RenderChart;
