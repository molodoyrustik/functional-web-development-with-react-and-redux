const compose = (...fns) => (arg) => {
  return fns.reduce((composed, f) => f(composed),arg);
}

// Сначала создадим ряд функций, предоставляющих значения и управляющих
// консолью. Нам понадобится функция, выдающая секунду, функция, выдающая те-
// кущее время, и пара функций, выводящих сообщения на консоль и очищающих
// ее. В функциональных программах везде, где только возможно, вместо значений
// будут использоваться функции. При необходимости получить значение мы станем
// вызывать функцию.

const oneSecond = () => 1000
const getCurrentTime = () => new Date()
const clear = () => console.clear()
const log = message => console.log(message)

// serializeClockTime — получает объект времени и возвращает объект для по-
// казания часов, содержащих часы, минуты и секунды;
// civilianHours — получает объект показания часов и возвращает объект, где
// показание часов преобразовано к формату гражданского времени. Например:
// 1300 превращается в 1 час;
// appendAMPM — получает объект показания часов и добавляет к нему время суток,
// AM или PM.

const serializeClockTime = date =>
  ({
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  })
const civilianHours = clockTime =>
  ({
    ...clockTime,
    hours: (clockTime.hours > 12) ?
      clockTime.hours - 12 :
      clockTime.hours
  })
const appendAMPM = clockTime =>
  ({
    ...clockTime,
    ampm: (clockTime.hours >= 12) ? "PM" : "AM"
  })

// Эти три функции используются для преобразования данных без изменения ис-
// ходного значения. В них аргументы рассматриваются как неизменяемые объекты.
// Затем нам понадобятся несколько функций высшего порядка.
// display — получает функцию цели target и возвращает функцию, которая будет
// отправлять время в адрес цели. В данном примере целью будет console.log .
// formatClock — получает шаблонную строку и использует ее для возвращения
// показания времени, отформатированного по критериям, заданным строкой.
// В данном примере шаблон имеет вид hh:mm:ss tt. Таким образом, formatClock
// будет заменять заполнители показаниями часов, минут, секунд и времени суток.
// prependZero — получает в качестве аргумента ключ объекта и ставит нуль впе-
// реди значения, хранящегося под этим ключом объекта. Функция получает ключ
// к указанному полю и ставит перед значениями нуль, если значение меньше 10.

const display = target => time => target(time)

const formatClock = format =>
  time =>
    format.replace("hh", time.hours)
      .replace("mm", time.minutes)
      .replace("ss", time.seconds)
      .replace("tt", time.ampm)


const prependZero = key => clockTime =>
  ({
    ...clockTime,
    [key]: (clockTime[key] < 10) ?
      "0" + clockTime[key] :
      clockTime[key]
  })

// Эти функции высшего порядка будут вызываться для создания функций, много-
// кратно использующихся для форматирования показания времени для каждо-
// го тика. Обе функции — и formatClock , и prependZero — будут вызываться единож-
// ды для начальной настройки требуемого шаблона или ключа. Возвращаемые ими
// внутренние функции будут вызываться один раз в секунду для форматирования
// отображаемого времени.

// Теперь, когда у нас есть все функции, требуемые для создания тикающих часов,
// нужно будет составить из них композицию. Для этого мы используем функцию-
// композицию, которая была определена в последнем разделе.
// convertToCivilianTime — отдельная функция, получающая в качестве аргумента
// показание времени и преобразующая его в формат гражданского времени с помощью
// обеих форм этого времени.
// doubleDigits — отдельная функция, получающая в качестве аргумента показа-
// ние времени и обеспечивающая отображение часов, минут и секунд парой цифр,
// подставляя для этого ноль, где необходимо.Функциональные концепции  69
// startTicking — запускает часы, устанавливая интервал, вызывающий функцию
// обратного вызова каждую секунду. Функция обратного вызова представляет
// собой композицию из всех наших функций. Каждую секунду консоль очища-
// ется, получается текущее время, показание которого проходит преобразование,
// перевод в гражданский формат, форматирование и отображение

const convertToCivilianTime = clockTime =>
  compose(
    appendAMPM,
    civilianHours
  )(clockTime)
const doubleDigits = civilianTime =>
  compose(
    prependZero("hours"),
    prependZero("minutes"),
    prependZero("seconds")
  )(civilianTime)
const startTicking = () =>
  setInterval(
    compose(
      clear,
      getCurrentTime,
      serializeClockTime,
      convertToCivilianTime,
      doubleDigits,
      formatClock("hh:mm:ss tt"),
      display(log)
    ),
    oneSecond()
  )
startTicking()