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

import Source from './source';
import SourceTab from './source-tab';
import TranslationDialog from './translation-dialog';

export default class ServiceProvider {
  //***** PRIVATE *****************************************************************************************************
  _createMultitranSource(connection) {
    let tabs = [];
    let serviceConfig = MultitranConfig;
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.TRANSLATIONS, {
      translationItemSelector: '.trans>a',
      serviceProvider: this
    }));
    let service = new DictionaryServiceProxy(serviceConfig, connection);
    return new Source(service, tabs);
  }

  _createAbbySource(connection, vocabulary) {
    let tabs = [];
    let serviceConfig = AbbyConfig;
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.TRANSLATIONS, {
      translationItemSelector: '.l-article__showExamp',
      serviceProvider: this
    }));
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.EXAMPLES));
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.PHRASES));
    let service = new DictionaryServiceProxy(serviceConfig, connection);
    return new Source(service, tabs);
  }

  _createGoogleSource(connection, vocabulary) {
    let tabs = [];
    let serviceConfig = GoogleConfig;
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.TRANSLATIONS, {
      translationItemSelector: '.gt-baf-word-clickable',
      serviceProvider: this
    }));
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.DEFINITIONS));
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.EXAMPLES));
    let service = new DictionaryServiceProxy(serviceConfig, connection);
    return new Source(service, tabs);
  }

  _createLingueeSource(connection, vocabulary) {
    let tabs = [];
    let serviceConfig = LingueeConfig;
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.TRANSLATIONS, {
      translationItemSelector: '.tag_trans>.dictLink',
      serviceProvider: this
    }));
    // tabs.push(new SourceTab(serviceConfig.id, ContentTypes.EXAMPLES));  
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.PHRASES));
    let service = new DictionaryServiceProxy(serviceConfig, connection);
    return new Source(service, tabs);
  }

  _createTfdSource(connection) {
    let tabs = [];
    let serviceConfig = TfdConfig;
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.THESAURUS));
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.DEFINITIONS));
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.VERBTABLE));
    let service = new DictionaryServiceProxy(serviceConfig, connection);
    return new Source(service, tabs);
  }

  _createLLSource(connection, vocabulary) {
    let tabs = [];
    let serviceConfig = LLConfig;
    tabs.push(new SourceTab(serviceConfig.id, ContentTypes.TRANSLATIONS, {
      translationItemSelector: '.ll-translation-item',
      translationWordSelector: '.ll-translation-text',
      serviceProvider: this
    }));
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
      let arr =
        [this._createLLSource(connection),
          this._createAbbySource(connection),
          this._createGoogleSource(connection),
          this._createLingueeSource(connection),
          this._createTfdSource(connection),
          this._createMultitranSource(connection)
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
      let langDetector = this.getLangDetector();
      let sources = this.getSources();
      this.dialog = new TranslationDialog(sources, vocabulary, langDetector);
    }
    return this.dialog;
  }
};