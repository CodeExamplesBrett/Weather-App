import { Component, OnInit } from '@angular/core';

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


  ngOnInit(): void {
    this.currentWeatherData = {
      main : {}
    }
    this.forecastData = {}
    this.getWeatherData();
    console.log(this.currentWeatherData);
  }

  getWeatherData(){
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=sydney&appid=${this.API_Key}&units=metric`)
    .then(response =>response.json()).then(data=>{this.setWeatherData(data);})
    //let data = JSON.parse('{"coord":{"lon":151.2073,"lat":-33.8679},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"base":"stations","main":{"temp":21.86,"feels_like":22.29,"temp_min":21.05,"temp_max":22.43,"pressure":1010,"humidity":84},"visibility":10000,"wind":{"speed":9.77,"deg":200},"clouds":{"all":75},"dt":1678561281,"sys":{"type":2,"id":2002865,"country":"AU","sunrise":1678564292,"sunset":1678609137},"timezone":39600,"id":2147714,"name":"Sydney","cod":200}')
    //this.setWeatherData(data:any)
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=sydney&appid=${this.API_Key}`)
    .then(response_2 =>response_2.json()).then(data_2=>{this.setForecastData(data_2);})

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

  setForecastData(data_2){
    this.forecastData = data_2;
    console.log('forecast', this.forecastData);

  }

}
