import fs from 'node:fs';
import os from 'node:os';
import { parse } from 'yaml';
import _ from 'lodash';

const FILE_PATH = `${os.homedir ()}/.config/nats-test/config.yml`;

export default class Store {
    static #store = new Map ();

    static get store () { return this.#store; }

    static readAndStore ({ file, name, type}) {
        if (!file)
            file = FILE_PATH;

        const fileContent = fs.readFileSync (file, 'utf8');
        const conf = parse (fileContent);

        Store.set ('name', name);
        Store.set ('type', type);
        Store.set ('port', _.get (conf, `${type}.${name}.port`));
        Store.set ('nats.subjects', _.get (conf, `${type}.${name}.nats.subjects`));
    }

    static get (key) {
        if (!key)
            throw new Error ('invalid key');

        if (!this.store)
            throw new Error ('store not initialized');

        const val = this.store[key];
        if (val)
            return val;

        throw new Error (`value for key: ${key} undefined `);
    }

    static set (key, value) {
        if (!this.store)
            throw new Error ('store not initailized');

        console.log ('setting {', key, ',', value, '} in store');
        this.#store[key] = value;
    }
}
