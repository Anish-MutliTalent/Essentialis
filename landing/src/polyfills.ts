import { Buffer } from 'buffer';
import $ from 'jquery';

if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || Buffer;
    window.jQuery = window.jQuery || $;
    window.$ = window.$ || $;
}
