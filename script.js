var Cal = function(divId) {

    //Сохраняем идентификатор div
    this.divId = divId;
  
    // Дни недели с понедельника
    this.DaysOfWeek = [
      'Пн',
      'Вт',
      'Ср',
      'Чт',
      'Пт',
      'Сб',
      'Вс'
    ];
  
    // Месяцы начиная с января
    this.Months =['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  
    //Устанавливаем текущий месяц, год
    var d = new Date();
  
    this.currMonth = d.getMonth();
    this.currYear = d.getFullYear();
    this.currDay = d.getDate();
  };
  
  // Переход к следующему месяцу
  Cal.prototype.nextMonth = function() {
    if ( this.currMonth == 11 ) {
      this.currMonth = 0;
      this.currYear = this.currYear + 1;
    }
    else {
      this.currMonth = this.currMonth + 1;
    }
    this.showcurr();
  };
  
  // Переход к предыдущему месяцу
  Cal.prototype.previousMonth = function() {
    if ( this.currMonth == 0 ) {
      this.currMonth = 11;
      this.currYear = this.currYear - 1;
    }
    else {
      this.currMonth = this.currMonth - 1;
    }
    this.showcurr();
  };
  
  // Показать текущий месяц
  Cal.prototype.showcurr = function() {
    this.showMonth(this.currYear, this.currMonth);
  };
  
  
  
  // Показать месяц (год, месяц)
  Cal.prototype.showMonth = function(y, m) {
  
    var d = new Date()
    // Первый день недели в выбранном месяце 
    , firstDayOfMonth = new Date(y, m, 7).getDay()
    // Последний день выбранного месяца
    , lastDateOfMonth =  new Date(y, m+1, 0).getDate()
    // Последний день предыдущего месяца
    , lastDayOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();
  
  
    var html = '<table>';
  
    // Запись выбранного месяца и года
    html += '<thead><tr>';
    html += '<td colspan="7">' + this.Months[m] + ' ' + y + '</td>';
    html += '</tr></thead>';
  
  
    // заголовок дней недели
    html += '<tr class="days">';
    for(var i=0; i < this.DaysOfWeek.length;i++) {
      html += '<td>' + this.DaysOfWeek[i] + '</td>';
    }
    html += '</tr>';
  
    // Записываем дни
    var i=1;
    do {
  
      var dow = new Date(y, m, i).getDay();
  
      // Начать новую строку в понедельник
      if ( dow == 1 ) {
        html += '<tr>';
      }
      
      // Если первый день недели не понедельник показать последние дни предидущего месяца
      else if ( i == 1 ) {
        html += '<tr>';
        var k = lastDayOfLastMonth - firstDayOfMonth+1;
        for(var j=0; j < firstDayOfMonth; j++) {
          html += '<td class="not-current">' + k + '</td>';
          k++;
        }
      }
  
      // Записываем текущий день в цикл
      var chk = new Date();
      var chkY = chk.getFullYear();
      var chkM = chk.getMonth();
      if (chkY == this.currYear && chkM == this.currMonth && i == this.currDay) {
        html += '<td class="day today">' + i + '</td>';
      } else {
        html += '<td class="day normal">' + i + '</td>';
      }
      // закрыть строку в воскресенье
      if ( dow == 0 ) {
        html += '</tr>';
      }
      // Если последний день месяца не воскресенье, показать первые дни следующего месяца
      else if ( i == lastDateOfMonth ) {
        var k=1;
        for(dow; dow < 7; dow++) {
          html += '<td class="not-current">' + k + '</td>';
          k++;
        }
      }
  
      i++;
    }while(i <= lastDateOfMonth);
  
    // Конец таблицы
    html += '</table>';
  
    // Записываем HTML в div
    document.getElementById(this.divId).innerHTML = html;

    const listTD = document.getElementsByClassName("day")
    let day = this.currDay
    let month = this.currMonth
    let year = this.currYear

    for (const item of listTD) {
      item.onclick = async function () {
        const listTodays = document.getElementsByClassName("today")
        for (const today of listTodays) {
          today.className = "day normal"
        }
        this.className = "day today"

        var response = await fetch("http://localhost:3000/getTimetableByGroup",
        {
          method: "POST",
          body: JSON.stringify(
            {
              "group": {
                "id": 42,
                "name": "21/О/ИСиП",
                "users": []
              },
              "date": `${this.textContent}.${month + 1}.${year}`
            }
          ),
          headers: {
            "Content-Type": "application/json",
          }
        })

        var timetable = await response.json()
        
        var data =  window.Telegram.WebApp.initData
        console.log(data)
        var div = document.getElementById("data")
        div.textContent = timetable.items[0].discipline
        
      }
    }
  };
  
  // При загрузке окна
  window.onload = async function() {
  
    // Начать календарь
    var c = new Cal("divCal");			
    c.showcurr();
  
    // Привязываем кнопки «Следующий» и «Предыдущий»
    getId('btnNext').onclick = function() {
      c.nextMonth();
    };
    getId('btnPrev').onclick = function() {
      c.previousMonth();
    };


    // await fetch("/connect", 
    // {
    //   method: 'GET',
    // })
    // .then(async (res) => console.log((await res.json()).items))
    // .catch((err) => console.log(err));

  }
  
  // Получить элемент по id
  function getId(id) {
    return document.getElementById(id);
  }
  