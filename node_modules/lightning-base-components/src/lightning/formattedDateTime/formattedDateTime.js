import { LightningElement, api, track } from 'lwc';
import { dateTimeFormat } from 'lightning/internationalizationLibrary';
import { isValidISODateTimeString } from 'lightning/iso8601Utils';
import { isIE11, normalizeBoolean } from 'lightning/utilsPrivate';

/**
 * Displays formatted date and time.
 */
export default class LightningFormattedDateTime extends LightningElement {
    /**
     * The value to be formatted, which can be a Date object, timestamp, or an ISO8601 formatted string.
     * @type {object}
     *
     */
    @api value;

    /**
     * Specifies how to display the day of the week. Allowed values are narrow, short, or long.
     * @type {string}
     *
     */
    @api weekday;

    /**
     * Allowed values are narrow, short, or long.
     * @type {string}
     *
     */
    @api era;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api year;

    /**
     * Allowed values are 2-digit, narrow, short, or long.
     * @type {string}
     *
     */
    @api month;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api day;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api hour;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api minute;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api second;

    /**
     * Allowed values are short or long. For example, the Pacific time zone would display as 'PST'
     * if you specify 'short', or 'Pacific Standard Time' if you specify 'long.'
     * @type {string}
     *
     */
    @api timeZoneName;

    /**
     * The time zone for date and time display. Use this attribute only if you want to override the default, which is the time zone
     * set on the user device. Specify a time zone from the IANA time zone database (https://www.iana.org/time-zones). For example, set
     * the value to 'Pacific/Honolulu' to display Hawaii time. The short code UTC is also accepted.
     * @type {string}
     *
     */
    @api timeZone;

    @track _hour12 = false;
    @track _hour12Set = false;

    /**
     * Determines whether time is displayed as 12-hour. If false, time displays as 24-hour. The default setting is determined by the user's locale.
     * @type {boolean}
     *
     */
    @api
    get hour12() {
        return this._hour12;
    }

    set hour12(value) {
        // If hour12 is not explicitly set, or when it's set to undefined, then locale default is used instead.
        if (value === undefined) {
            this._hour12Set = false;
            this._hour12 = value;
        } else {
            this._hour12Set = true;
            this._hour12 = normalizeBoolean(value);
        }
    }

    get formattedValue() {
        return this.computeFormattedValue();
    }

    computeFormattedValue() {
        const { value } = this;
        if (!this.isEmpty(value) && this.isValid(value)) {
            const formatted = dateTimeFormat(this.getOptions()).format(value);
            if (formatted) {
                return formatted;
            }
        }
        this.printError(value);
        return '';
    }

    isEmpty(value) {
        return value === undefined || value === null || value === '';
    }

    isValid(value) {
        return isFinite(value) || isValidISODateTimeString(value);
    }

    printError(value) {
        const errorMsg =
            `<lightning-formatted-date-time> The value attribute accepts either a Date object, a timestamp, or a valid ISO8601 formatted string ` +
            `with timezone offset. but we are getting the ${typeof value} value "${value}" instead.`;
        console.warn(errorMsg); // eslint-disable-line no-console
    }

    getOptions() {
        const options = {
            weekday: this.weekday,
            era: this.era,
            year: this.year,
            month: this.month,
            day: this.day,
            hour: this.hour,
            minute: this.minute,
            second: this.second,
            timeZoneName: this.timeZoneName,
            timeZone: this.timeZone,
        };
        // If hour12 is set, then we use it, otherwise locale defaults will be used
        if (this._hour12Set) {
            options.hour12 = this.hour12;
        }
        // TODO: W-7787708: Remove hourCycle workaround below when possible.
        // W-7583911: Temporarily works around an hourCycle spec bug that only Chrome has
        // implemented causing the default hourCycle to be 'h24' rather than 'h23' when hour12 is
        // false in 12-hour locales. Chrome ends up displaying times like '24:45'. Spec bug fix PR:
        // https://github.com/tc39/ecma402/pull/436/files
        //
        // IE11 is excluded due to missing support for hourCycle:
        // https://caniuse.com/#feat=mdn-javascript_builtins_intl_datetimeformat_datetimeformat_hourcycle
        //
        // Detecting IE11 is more stable than detecting Chrome at this point due to possible false
        // positives as browser vendors such as Opera and Microsoft adopt Chrome.
        if (options.hour12 === false && !isIE11) {
            options.hourCycle = 'h23';
            delete options.hour12;
        }
        return options;
    }
}
