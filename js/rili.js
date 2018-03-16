(function () {
	// 定义一些API
	var _calendar = {
		// 定义一些默认参数
	    _def: {
	      opendate: new Date(),
	      classtime: [],
	      weekSelect: [],
	      weekLength: 0,
	      order: '',
	      active:''
	    },
	    // 获取ID元素
	    getId: function (id) {
	      return document.getElementById(id)
	    },
	    // 获取css类名元素
	    getByClassName: function (className, parent) {
	      var elem = [],
	        node = parent !== undefined && parent.nodeType === 1 ? parent.getElementsByTagName('*') : document.getElementsByTagName('*'),
	        p = new RegExp('(^|\\s)' + className + '(\\s|$)')
	      for (var n = 0, i = node.length; n < i; n++) {
	        if (p.test(node[n].className)) {
	          elem.push(node[n])
	        }
	      }
	      return elem
	    },
	    // 监听点击事件
	    addEventHandler: function (target, type, fn) {
	      if (target.addEventListener) {
	        target.addEventListener(type, fn)
	      } else {
	        target.attachEvent('on' + type, fn)
	      }
	    },
	    // 每日上下晚循环
	    getStr: function (year, month, i) {
	      var week = new Date(year, month, i).getDay()
	      // month = month<10 ? '0'+month : month
	      // i = i < 10 ? '0'+i : i
	      var str = ''
	      var _date = ''
	      var text = ''
	      var _that = this
	      let active = ''
	      let order = ''
	      let arr = []
	      	_date = year + '-' + (month + 1) + '-' + i
	      	for (var j = 1; j <= 3; j++) {
		        switch (j) {
		          case 1:
		            text = '上午'
		            break
		          case 2:
		            text = '下午'
		            break
		          case 3:
		            text = '晚上'
		            break
		        }
		      	order = ''
		        active = ''
		      	_calendar._def.classtime.forEach(function(value, index){
		        	if (value.classtime == _date) {
		        		console.log(value)
		        		if (value.day == j) {
		        			order = '第' + ( index + 1 ) + '节'
		        			active = ' active'
		        		} else {
		        		}
		        	}
		        })
        		str += "<span data-date='" + _date + "' data-week='" + week + "' data-day='" + j + "' class='spanclass" + active + "'>" + text + order + '</span>'
        	}
	      return str
	    },
	    sortNumber: function (a, b) {
	      return (new Date(a['classtime']).getTime() == new Date(b['classtime']).getTime()) ? a['day'] - b['day'] : new Date(a['classtime']).getTime() - new Date(b['classtime']).getTime()
	    },
	    span: function () {
	      var _that = this
	      _calendar._def.classtime.sort(this.sortNumber)
	      _that.active = _that.getByClassName('active')
	      for (var j = 0; j < _that.active.length; j++) {
	        var dataDay = parseInt(_that.active[j].getAttribute('data-day'))
	        var dataDate = _that.active[j].getAttribute('data-date')
	        for (var c = 0; c < _calendar._def.classtime.length; c++) {
	          if (_calendar._def.classtime[c].classtime === dataDate) {
	            if (_calendar._def.classtime[c].day === dataDay) {
	              var indexof = c
	              var order = '第' + (indexof + 1) + '节课'
	              switch (dataDay) {
	                case 1:
	                  _that.active[j].innerHTML = '上午' + order
	                  break
	                case 2:
	                  _that.active[j].innerHTML = '下午' + order
	                  break
	                case 3:
	                  _that.active[j].innerHTML = '晚上' + order
	                  break
	                default:
	                  _that.active[j].innerHTML = _that.active[j].innerHTML
	                  break
	              }
	            }
	          }
	        }
	      }
	    },
	    getClassTime: function () {		
	    	var _that = this
	      	var _year = _calendar._def.opendate.getFullYear()
	    	var _month = _calendar._def.opendate.getMonth()
	    	var _datea = _calendar._def.opendate.getDate()
	    	var newdate = ''
	    	console.log(_year, _month, _datea)
	      	_that.spanclass = this.getByClassName('spanclass')
			if (_calendar._def.weekSelect.length) {
				for (var i = _datea; i < 368; i++ ) {
		    		newdate = new Date(_year, _month, i)
		    		dateString = newdate.getFullYear() + '-' + (newdate.getMonth()+1) + '-' + newdate.getDate()
		    		var obj = {}
			        _calendar._def.classtime.forEach(function (value) {
			          obj[JSON.stringify(value)] = value
			        })
			        _calendar._def.classtime = Object.keys(obj).map(u => {
			          return JSON.parse(u)
			        })
		    		if (_calendar._def.classtime.length < 28) {
		    			_calendar._def.weekSelect.forEach(function(val){
		    				if (newdate.getDay() == val.week) {
			    				_calendar._def.classtime.push({
				    				classtime: dateString,
				    				day: val.day
				    			})
				    		}
						})
		    		}
		    	}
				console.log(_calendar._def.classtime.sort(this.sortNumber))
				_that.drawDate()
				// for (var p = 0; p < _calendar._def.weekSelect.length; p++) {}
			}
	    },
	    drawDate: function () {
	      this.oDivH = this.getId('titleText')
	      this.oDivMain = this.getId('calendarDiv')
	      var _this = this
	      // 获取年月
	      var year = _calendar._def.opendate.getFullYear()
	      var month = _calendar._def.opendate.getMonth()
	      var showStr = ''
	      // 显示头部内容
	      this.oDivH.innerHTML = "<span id='year'>" + year + "</span>年<span id='month'>" + (month + 1) + '</span>月'
	      // 判断闰年还是平年
	      var leapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 1 : 0
	        // 每个月的天数
	      var everyMonthDays = new Array(31, 28 + leapYear, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
	        // 每个月的天数
	      var monthDay = []
	        // 当月1号星期几
	      var firstDay = new Date(year, month, 1).getDay()
	      // 输出日历表格 - 开始
	      showStr = "<table class='cld-w' border='1' cellspacing='0' cellpadding='0'><thead>"
	      showStr += '<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>'
	      showStr += '</thead><tbody><tr>'
	      // 输出日历表格 - 主要展示区
	      /* 上月 */
	      var permonth = (month !== 0 ? month - 1 : everyMonthDays.length - 1)
	      // 如果这个月 = 0,即1月,则上月的year要 - 1
	      var perYear = month === 0 ? year - 1 : year
	      var monthPrevDay = everyMonthDays[permonth]
	      for (var i = (monthPrevDay - firstDay) + 1; i <= monthPrevDay; i++) {
	        var strText = this.getStr(perYear, permonth, i)
	        showStr += "<td><div class='cDic oldDay'><p>" + i + '</p>' + strText + '</div></td>'
	      }
	      /* 本月 */
	      for (var i = 1; i <= everyMonthDays[month]; i++) {
	        var strText = this.getStr(year, month, i)
	        showStr += "<td><div class='cDic'><p>" + i + '</p>' + strText + '</div></td>'
	        firstDay = (firstDay + 1) % 7
	        if (firstDay === 0 && i !== monthDay) {
	          showStr += '</tr><tr>'
	        }
	      }
	      /* 下月 */
	      var nextmonth = (month !== 11 ? month + 1 : 0)
	      // 如果这个月 = 11,即12月,则下月的year要 + 1
	      var nextYear = month === 11 ? year + 1 : year
	      for (var i = 1; i <= 7 - firstDay; i++) {
	        var strText = this.getStr(nextYear, nextmonth, i)
	        showStr += "<td><div class='cDic oldDay'><p>" + i + '</p>' + strText + '</div></td>'
	      }
	      // 输出日历表格 - 结束
	      showStr += '</tr></tbody></table>'
	      this.oDivMain.innerHTML = showStr
	    },
	    preMonth: function () {
	      var _that = this
	      _calendar._def.opendate = new Date(_calendar._def.opendate.getFullYear(), _calendar._def.opendate.getMonth() - 1, 1)
	      _that.drawDate()
	      _that.spanEvent()
	    },
	    nextMonth: function () {
	      var _that = this
	      _calendar._def.opendate = new Date(_calendar._def.opendate.getFullYear(), _calendar._def.opendate.getMonth() + 1, 1)
	      _that.drawDate()
	      _that.spanEvent()
	    },
	    spanEvent: function () {
	      var _that = this
	      _that.spanclass = this.getByClassName('spanclass')
	      for (let i = 0; i < _that.spanclass.length; i++) {
	        _that.spanclass[i].onclick = function () {
	          // console.log(_calendar._def.classtime)
	        }
	        _that.addEventHandler(_that.spanclass[i], 'click', function () {
	          if (this.getAttribute('class').indexOf('active') === -1) {
	            if (_calendar._def.classtime.length < 28) {
	              this.setAttribute('class', 'spanclass active')
	              _calendar._def.classtime.push({
	                classtime: this.getAttribute('data-date'),
	                day: parseInt(this.getAttribute('data-day'))
	              })
	            } else {
	              alert('您已经设置28节课，不能再设置！')
	            }
	            _that.span()
	          } else {
	            var dataDay = parseInt(this.getAttribute('data-day'))
	            var dataDate = this.getAttribute('data-date')
	            var indexof = ''
	            for (var c = 0; c < _calendar._def.classtime.length; c++) {
	              if (_calendar._def.classtime[c].classtime === dataDate) {
	                if (_calendar._def.classtime[c].day === dataDay) {
	                  indexof = c
	                  switch (dataDay) {
	                    case 1:
	                      this.innerHTML = '上午'
	                      break
	                    case 2:
	                      this.innerHTML = '下午'
	                      break
	                    case 3:
	                      this.innerHTML = '晚上'
	                      break
	                    default:
	                      this.innerHTML = this.innerHTML
	                      break
	                  }
	                }
	              }
	            }
	            this.setAttribute('class', 'spanclass')
	            _calendar._def.classtime.splice(indexof, 1)
	            _that.span()
	          }
	        })
	      }
	    },
	    // 初始化
	    init: function (str, opentime, weekSelect) {
	      _calendar._def.weekLength = 0
	      _calendar._def.opendate = str
	      _calendar._def.classtime = opentime
	      _calendar._def.weekSelect = weekSelect
	      this.oDivpre = this.getId('preDiv')
	      this.oDivNext = this.getId('nextDiv')
	      var _that = this
	      this.oDivpre.onclick = function () {
	        _that.preMonth()
	      }
	      this.oDivNext.onclick = function () {
	        _that.nextMonth()
	      }
	      // this.btnEvent()
	      this.drawDate()
	      this.spanEvent()
	      this.getClassTime()
	      return _calendar._def.classtime
	    }
	}
	// 确定插件的名称
	this.Calendar = _calendar
})()
