import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-app-main',
  templateUrl: './weather-app-main.component.html',
  styleUrls: ['./weather-app-main.component.scss']
})
export class WeatherAppMainComponent implements OnInit {
  constructor() { }

  currentTime = new Date();

  currentWeatherData:any ={};
  forecastData:any = {};

  API_Key = '77c680e8479d51757112c4f74394323f'

  fiveDayForecast:any = [];
  allForecastData:any = [];
  tempMaxMinData:any = [];
  results:any = [];
  combo:any = [];

  fiveDayForecastPopulated = false;

  dayDetailsVisible: { [key: number]: boolean } = {};

  currentDate: string | undefined;
  highestMax: number | undefined;
  lowestMin: number | undefined;
  intervalId: any;


  /**
   * This function initiates the component with the lifecycle hook ngOnInit()
   * setInterval is then used to update the data every 10 minutes
   */
  ngOnInit(): void {
    this.getWeatherData();
    this.intervalId = setInterval(()=> {
      this.getWeatherData();
      console.log('******************* RELOADED ******************************')
    }, 600000);   // Call getWeatherData() every 600000 milliseconds (10 minutes)
  }


  ngOnDestroy(): void {
    clearInterval(this.intervalId); // Clear the interval when the component is destroyed
  }


 /**
  * This function fetches weather data (todays & forcast) from the openweathermap API
  */
  async getWeatherData() {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Bad Rodach&appid=${this.API_Key}&units=metric`);
      const data = await response.json();
      this.setWeatherData(data);
  
      const response_2 = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Bad Rodach&appid=${this.API_Key}&units=metric`);
      const data_2 = await response_2.json();
      this.setForecastData(data_2);
    } catch (error) {
      console.error(error);
    }
  }


  /**
   * This function selects weather data for display for today
   * @param {object} data 
   */
  setWeatherData(data){
    this.currentWeatherData = data;
    this.currentWeatherData.temp = this.currentWeatherData.main.temp.toFixed(0);
    this.currentWeatherData.city = this.currentWeatherData.name;
    this.currentWeatherData.icon = this.currentWeatherData.weather[0].icon;
    this.currentWeatherData.feelsLike = this.currentWeatherData.main.feels_like;
    this.currentWeatherData.description = this.currentWeatherData.weather[0].description;
    this.currentWeatherData.pressure = this.currentWeatherData.main.pressure;
    this.currentWeatherData.humidity = this.currentWeatherData.main.humidity;

    console.log('temp', this.currentWeatherData.temp)
    console.log('all weather',this.currentWeatherData);
    console.log('icon', this.currentWeatherData.icon);
  }


  /**
   * This function pushes the fetched forecast data to the array "allForecastData"
   * then calls the next functions required to format the data
   * @param {object} data_2
   */
  setForecastData(data_2){
    this.forecastData = data_2;
    // clear the array
    this.fiveDayForecast = [];
    // .list is used here because we can't get the length of an object muss be an array...
    //all forecast data
    for (let i = 0; i < this.forecastData.list.length; i++) {
      this.allForecastData.push(this.forecastData.list[i]);
    }
    this.fiveDayData();
    this.selectData();
    this.combineData();
    console.log('forecast', this.forecastData)
  }


  /**
   * This function selects the first record of each date for the forecast data
   * then pushes the resultant records to the array fiveDayForecast
   */
  fiveDayData(){
    for (let i = 0; i < this.forecastData.list.length; i= i + 8) {
      this.fiveDayForecast.push(this.forecastData.list[i] );
    }
    this.fiveDayForecastPopulated = true;
    console.log('5day', this.fiveDayForecast)
  }


  /**
   * This function selects out only the relevant data needed to calculate the
   * highest Max and lowest Min for each date... carried out in 
   * subsequent function: findHighestMaxAndLowestMin() called here.
   */
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
    this.results = this.findHighestMaxAndLowestMin(this.tempMaxMinData, this.currentDate, this.highestMax, this.lowestMin );
    // calculated max / min restricted to 5 days .. depending on the time of day 5 or 6 results could be generated
    if(this.results.length >= 6){
      this.results.pop();
    }
    console.log('the reults', this.results);
  }


  /**
   * This function combines the arrays results and fiveDayForecast so that the resultant array
   * can be used in *ngFor loop in weather-app-main.component.html
   */
  combineData(){
    if (this.fiveDayForecastPopulated){
      this.combo.length = 0;
      this.results.forEach((el, index) => this.combo.push([el, this.fiveDayForecast[index]]));

      console.log('the combo', this.combo)
    } else {
      console.log('fiveDayForecast not populated yet')
    }
    
  }


  /**
   * This function finds the lowest min temperature and highest Max temperature for each day
   * currentDate, highestMax, lowestMin are initially undefined (declared above)
   * @param {array} tempMaxMinData 
   * @param {string} currentDate | undefined;
   * @param {number} highestMax | undefined;
   * @param {number} lowestMin | undefined;
   * @returns 
   */
  findHighestMaxAndLowestMin(tempMaxMinData, currentDate, highestMax, lowestMin ) {
    //reset results array
    const results = [];
    for (const record of tempMaxMinData) {
      const date = this.extractDate(record.dt_txt);
      if (date !== currentDate) {
        // If the date has changed, push the previous day's results into the array.. initally undef 
        if (currentDate) {
          this.pushResults(results, currentDate, highestMax, lowestMin);
        }
        // Reset the variables for the new day
        currentDate = date;
        highestMax = undefined;
        lowestMin = undefined;
      }
      const currentMaxMin = this.updateHighestMaxLowestMin({highestMax, lowestMin}, record);
      highestMax = currentMaxMin.highestMax;
      lowestMin = currentMaxMin.lowestMin;
    }
    // Push the results for the last day as there is no other date for comparision (outside of for loop)
    if (currentDate) {
      this.pushResults(results, currentDate, highestMax, lowestMin);
    }
    return results;
  }


  /**
   * This function returns just the relevant date data required for comparision.
   * @param {string} dateTimeString 
   * @returns 
   */
  extractDate(dateTimeString) {
    return dateTimeString.slice(0, 10);
  }


/**
 * This function pushes the Calculated days result to the results array
 * @param {array} results 
 * @param {string} currentDate
 * @param {number} highestMax 
 * @param {number} lowestMin  
 */
  pushResults(results, currentDate, highestMax, lowestMin) {
    results.push({
      date: currentDate,
      highestMax: highestMax,
      lowestMin: lowestMin,
    });
  }


  /**
   * This function compares current highest and lowest values for the day with record from the loop 
   * if they are the lowest or highest the corresponding current high or low is updated.
   * @param {object} currentMaxMin 
   * @param {object} record 
   * @returns 
   */
  updateHighestMaxLowestMin(currentMaxMin: {highestMax, lowestMin}, record): {highestMax, lowestMin} {
    const highestMax = currentMaxMin.highestMax === undefined || record.main.temp_max > currentMaxMin.highestMax
      ? record.main.temp_max
      : currentMaxMin.highestMax;
    const lowestMin = currentMaxMin.lowestMin === undefined || record.main.temp_min < currentMaxMin.lowestMin
      ? record.main.temp_min
      : currentMaxMin.lowestMin;

    return {highestMax, lowestMin};
  }

  /**
   * This function toggles the details for each day of the forecast -- visible / hidden.
   * @param {number} index - index of weather details for that day with corresponding boolean true/false
   */
  toggleDayDetails(index: number): void {
    this.dayDetailsVisible[index] = !this.dayDetailsVisible[index];
    console.log('visable', this.dayDetailsVisible)
  }
}


