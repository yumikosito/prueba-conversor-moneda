
const btn=document.getElementById("searchButton")
const result=document.getElementById("result")


function pagAPI(){
  const divisa= String(typeMoney.options[typeMoney.selectedIndex].value)
  const pagAPI= "https://mindicador.cl/api/"+divisa
  return pagAPI
}
async function error() {
  try {
  const res = await fetch(pagAPI());
  const data = await res.json();
  console.log(data);
  } catch (e) {
    const errorSpan = document.getElementById("errorSpan");
    errorSpan.innerHTML = "Algo salió mal! Error: ${e.message}";
  }
}

async function datasMoney(){
  let resultado= await fetch(pagAPI())
  const dataMoney = await resultado.json();
  return dataMoney
}

async function getAndCreateDataToChart() {
  const monedas = await datasMoney()
  let monedas_N= monedas.serie.splice(0,10)
  monedas_N= monedas_N.sort((a, b) => a.fecha.localeCompare(b.fecha));

  const labels = monedas_N.map((moneda) => {
    const fechaFix= moneda.fecha.split("T")[0]
    return fechaFix;
  });

  const data = monedas_N.map((moneda) => {
    return Number(moneda.valor);
  });

  const datasets = [
    {label: "Valor moneda",
    borderColor: "rgb(255, 99, 132)",
    data}];
  return { labels, datasets };
  }

async function renderGrafica() {
  const data = await getAndCreateDataToChart();
  const config = {
  type: "line",
  data
  };
  const myChart = document.getElementById("myChart");
  myChart.style.backgroundColor = "white";
  new Chart(myChart, config);
  
}


btn.addEventListener("click", async ()=>{
  const moneyInput=Number(document.getElementById("moneyInput").value)
  const moneyAPI= await datasMoney()
  const actualMoney=Number(moneyAPI.serie[0].valor)
  const totalHoy=(moneyInput/actualMoney).toFixed(2)
  result.innerHTML=totalHoy
  renderGrafica();
})


