import { Component, OnInit } from '@angular/core';

interface WeatherData {
  main: {
    temp_max: number;
    temp_min: number;
    
  };
  dt_txt: string;
}

interface Results {
  date: string;
  highestMax: number;
  lowestMin: number;
}


@Component({
  selector: 'app-weather-app-main',
  templateUrl: './weather-app-main.component.html',
  styleUrls: ['./weather-app-main.component.scss']
})
export class WeatherAppMainComponent implements OnInit {

  

  constructor() { }

  currentWeatherData:any;
  forecastData:any;
  API_Key = '77c680e8479d51757112c4f74394323f'

  fiveDayForecast:any = [];
  allForecastData:any = [];
  tempMaxMinData:any = [];

  combo:any = [];

  fiveDayForecastPopulated = false;

  resultData = [];


  
  ngOnInit(): void {
    this.currentWeatherData = {
      main : {}
    }
    this.forecastData = {}
    this.getWeatherData();
    console.log(this.currentWeatherData);
    
  }

  getWeatherData(){
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=Munich&appid=${this.API_Key}&units=metric`)
    .then(response =>response.json())
    .then(data=>{this.setWeatherData(data);})
    //let data = JSON.parse('{"coord":{"lon":151.2073,"lat":-33.8679},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"base":"stations","main":{"temp":21.86,"feels_like":22.29,"temp_min":21.05,"temp_max":22.43,"pressure":1010,"humidity":84},"visibility":10000,"wind":{"speed":9.77,"deg":200},"clouds":{"all":75},"dt":1678561281,"sys":{"type":2,"id":2002865,"country":"AU","sunrise":1678564292,"sunset":1678609137},"timezone":39600,"id":2147714,"name":"Sydney","cod":200}')
    //this.setWeatherData(data:any)
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=Munich&appid=${this.API_Key}&units=metric`)
    .then(response_2 =>response_2.json())
    .then(data_2=>{this.setForecastData(data_2);})

  }

  setWeatherData(data){
    this.currentWeatherData = data;
    this.currentWeatherData.temp = this.currentWeatherData.main.temp.toFixed(0);
    this.currentWeatherData.city = this.currentWeatherData.name;
    this.currentWeatherData.icon = this.currentWeatherData.weather[0].icon;

    console.log(this.currentWeatherData.temp)
    console.log(this.currentWeatherData);
    console.log(this.currentWeatherData.icon);
  }

  async setForecastData(data_2){
    this.forecastData = data_2;
    
    // clear the array
    this.fiveDayForecast = [];
    // .list is used here because we can't get the length of an object muss be an array...
    

    //all forecast data
    for (let i = 0; i < this.forecastData.list.length; i++) {
      this.allForecastData.push(this.forecastData.list[i]);
    }

    await this.fiveDayData();
    this.selectData();
    
    console.log('forecast', this.forecastData);

    
    
  }

  fiveDayData(){
    for (let i = 0; i < this.forecastData.list.length; i= i + 8) {
      this.fiveDayForecast.push(this.forecastData.list[i] );
    }
    this.fiveDayForecastPopulated = true;
    console.log('5day', this.fiveDayForecast)
  }

  

  selectData(){
    for (let i = 0; i < this.allForecastData.length; i++) {
      let tmax = this.allForecastData[i].main.temp_max;
      let tmin = this.allForecastData[i].main.temp_min;
      let readingDate = this.allForecastData[i].dt_txt;

      let tempJson = {temp_min: tmin, temp_max: tmax}
      
      let readingDateJson = {main: tempJson, dt_txt: readingDate}
      this.tempMaxMinData.push(readingDateJson);
      
      
    }
    console.log('data out', this.tempMaxMinData)
    this.results = this.findHighestMaxAndLowestMin(this.tempMaxMinData);
    
    console.log('the reults', this.results);
    this.combineData();
  }

  combineData(){
    if (this.fiveDayForecastPopulated){
      this.combo = this.results.map((el, index) => [el, this.fiveDayForecast[index]]);
      console.log('the combo', this.combo)
    } else {
      console.log('fiveDayForecast not populated yet')
    }
    
  }



  results: Results[] = [];

  //results: Results[] = this.findHighestMaxAndLowestMin(this.data);

  findHighestMaxAndLowestMin(tempMaxMinData: WeatherData[]): Results[] {
    const results: Results[] = [];

    // Initialize variables to hold the highest max and lowest min for each day
    let currentDate: string | undefined;
    let highestMax: number | undefined;
    let lowestMin: number | undefined;

    // Loop through the weather data
    for (const datum of tempMaxMinData) {
      const date = datum.dt_txt.slice(0, 10); // Extract the date from the date-time string

      if (date !== currentDate) {
        // If the date has changed, push the previous day's results into the array
        if (currentDate) {
          results.push({
            date: currentDate,
            highestMax: highestMax!,
            lowestMin: lowestMin!,
          });
        }

        // Reset the variables for the new day
        currentDate = date;
        highestMax = undefined;
        lowestMin = undefined;
      }

      // Update the highest max and lowest min for the current day
      if (highestMax === undefined || datum.main.temp_max > highestMax) {
        highestMax = datum.main.temp_max;
      }
      if (lowestMin === undefined || datum.main.temp_min < lowestMin) {
        lowestMin = datum.main.temp_min;
      }
    }

    // Push the results for the last day
    if (currentDate) {
      results.push({
        date: currentDate,
        highestMax: highestMax!,
        lowestMin: lowestMin!,
      });
    }

    return results;
  }
}




 



  


