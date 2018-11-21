/**
 * Created by Administrator on 2018/2/25.
 */
import Datastore from 'nedb'
import path from 'path'
import {remote} from 'electron'

let db = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/data.db')
});

let db1 = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/data1.db')
});
let psw = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/data2.db')
});

let title = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/data3.db')
});

let setting = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/data4.db')
});

let labData = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/data5.db')
});

let imgData = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getAppPath(), '..', '/data6.db')
});


export {db, db1, psw, title, setting, labData,imgData};