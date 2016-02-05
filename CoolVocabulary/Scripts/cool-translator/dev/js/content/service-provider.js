'use strict';

import AbbyConfig from '../services/abby/config';
import GoogleConfig from '../services/google/config';
import LingueeConfig from '../services/linguee/config';
import LLConfig from '../services/ll/config';
import MultitranConfig from '../services/multitran/config';
import TFDConfig from '../services/tfd/config';
import CVConfig from '../services/cv/config';
import ServicesConnection from '../services/services-connection';
import Vocabulary from '../services/vocabulary';
import LangDetector from '../services/lang-detector';
import DictionaryServiceProxy from '../services/dictionary-service-proxy';

import ContentTypes from '../services/common/content-types';

import Source from '../controls/source';
import SourceTab from '../controls/source-tab';
import TranslationDialog from '../controls/translation-dialog';
import AddTranslation from '../controls/add-translation';

export default class ServiceProvider {
  //***** PRIVATE *****************************************************************************************************

  _createAddTranslation(vocabulary, translationItemSelector, translationWordSelector){
    return new AddTranslation(vocabulary, translationItemSelector, translationWordSelector);
  }

  _createMultitranSource(connection, vocabulary) {
    let tabs = [];
    let serviceConfig = MultitranConfig;
    let addTranslation = this._createAddTranslation(vocabulary, '.trans>a');
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.TRANSLATIONS, addTranslation));
    let service = new DictionaryServiceProxy(serviceConfig, connection);
    return new Source(service, tabs);
  }

  _createAbbySource(connection, vocabulary) {
    let tabs = [];
    let serviceConfig = AbbyConfig;
    let addTranslation = this._createAddTranslation(vocabulary, '.l-article__showExamp');
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.TRANSLATIONS, addTranslation));
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.EXAMPLES));
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.PHRASES));
    let service = new DictionaryServiceProxy(serviceConfig, connection);
    return new Source(service, tabs);
  }

  _createGoogleSource(connection, vocabulary) {
    let tabs = [];
    let serviceConfig = GoogleConfig;
    let addTranslation = this._createAddTranslation(vocabulary, '.gt-baf-word-clickable');
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.TRANSLATIONS, addTranslation));
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.DEFINITIONS));
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.EXAMPLES));
    let service = new DictionaryServiceProxy(serviceConfig, connection);
    return new Source(service, tabs);
  }

  _createLingueeSource(connection, vocabulary) {
    let tabs = [];
    let serviceConfig = LingueeConfig;
    let addTranslation = this._createAddTranslation(vocabulary, '.tag_trans>.dictLink');
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.TRANSLATIONS, addTranslation));
    // tabs.push(new SourceTab(serviceConfig.id, ContentTypes.EXAMPLES));  
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.PHRASES));
    let service = new DictionaryServiceProxy(serviceConfig, connection);
    return new Source(service, tabs);
  }

  _createTfdSource(connection) {
    let tabs = [];
    let serviceConfig = TFDConfig;
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.THESAURUS));
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.DEFINITIONS));
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.VERBTABLE));
    let service = new DictionaryServiceProxy(serviceConfig, connection);
    return new Source(service, tabs);
  }

  _createLLSource(connection, vocabulary) {
    let tabs = [];
    let serviceConfig = LLConfig;
    let addTranslation = this._createAddTranslation(vocabulary, '.ll-translation-item', '.ll-translation-text');    
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.TRANSLATIONS, addTranslation));
    let service = new DictionaryServiceProxy(serviceConfig, connection);
    return new Source(service, tabs);
  }

  //***** PUBLIC *******************************************************************************************************

  getConnection() {
    if (!this.connection) {
      this.connection = new ServicesConnection("services_connection");
      this.connection.open();
    }
    return this.connection;
  }

  getVocabulary() {
    if (!this.vocabulary) {
      let connection = this.getConnection();
      this.vocabulary = new Vocabulary(CVConfig, connection);
    }
    return this.vocabulary;
  }

  getLangDetector() {
    if (!this.langDetector) {
      let connection = this.getConnection();
      this.langDetector = new LangDetector(GoogleConfig, connection);
    }
    return this.langDetector;
  }

  getSources() {
    if (!this.sources) {
      let self = this;
      let connection = this.getConnection();
      let vocabulary = this.getVocabulary();
      let arr =
        [this._createLLSource(connection, vocabulary),
          this._createAbbySource(connection, vocabulary),
          this._createGoogleSource(connection, vocabulary),
          this._createLingueeSource(connection, vocabulary),
          this._createTfdSource(connection),
          this._createMultitranSource(connection, vocabulary)
        ];
      arr.sort(function(a, b) {
        return a.config.priority > b.config.priority ? -1 : 1;
      });
      this.sources = {};
      arr.forEach(function(source) {
        source.init();
        self.sources[source.config.id] = source;
      });
    }
    return this.sources;
  }

  getDialog() {
    if (!this.dialog) {
      let sources = this.getSources();
      let vocabulary = this.getVocabulary()
      let langDetector = this.getLangDetector();
      this.dialog = new TranslationDialog(sources, vocabulary, langDetector);
    }
    return this.dialog;
  }
};