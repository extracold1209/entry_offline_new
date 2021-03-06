import _ from 'lodash';
import root from 'window-or-global';
import Utils from '../helper/rendererUtils';
import { EntryStatic } from '../bower_components/entry-js/extern/util/static.js';

/**
 * entryjs 내 포함되어있는 EntryStatic 에 추가적인 코드를 덮어쓰기 하는 로직
 */

const originGetAllBlocks = EntryStatic.getAllBlocks;
EntryStatic.getAllBlocks = (() =>
    _.memoize(() => {
        const allBlocks = originGetAllBlocks();
        const arduino = _.find(allBlocks, ['category', 'arduino']);
        const { blocks } = arduino;
        const index = blocks.indexOf('arduino_open');
        blocks.splice(index, 1);
        return allBlocks;
    }))();

EntryStatic.getName = function(str, type) {
    let dict = SpriteNames;
    if (type == 'picture') {
        dict = PictureNames;
    } else if (type == 'sound') {
        dict = SoundNames;
    }

    let lang = navigator.language ? navigator.language : 'ko';
    if (root.lang) {
        lang = root.lang;
    }

    if (window.user && window.user.language) {
        lang = window.user.language;
    }

    if (!dict || (lang && lang.indexOf('ko') != -1)) {
        return str;
    }
    return dict[str] ? dict[str] : str;
};

const sharedObject = Utils.getSharedObject();
EntryStatic.baseUrl = sharedObject && `${sharedObject.hostProtocol}//${sharedObject.hostURI}`;
export default EntryStatic;
