import moment from 'moment';

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


// function to filter data from any array
export function filterItems (array, text, column)  {
    if (text === '') {
        return array;
    }

    text = text.toLowerCase();

    return array.filter(item => {
        return item[column].toLowerCase().includes(text);
    });
}

const date = new Date()

// export date format 
export default {
 dateNow: moment().format('Y/M/D'),
 receipt: date.getFullYear("YYYY") + date.getMonth() + date.getDay() + Math.floor(Math.random() * 100)
}
