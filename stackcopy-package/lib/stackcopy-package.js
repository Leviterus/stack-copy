'use babel';

import StackcopyPackageView from './stackcopy-package-view';
import { CompositeDisposable } from 'atom';

var stack =  []

export default {

  stackcopyPackageView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.stackcopyPackageView = new StackcopyPackageView(state.stackcopyPackageViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.stackcopyPackageView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'stackcopy-package:toggle': () => this.toggle(),
      'stackcopy-package:copy': () => this.copy(),
      'stackcopy-package:paste': () => this.paste()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.stackcopyPackageView.destroy();
  },

  serialize() {
    return {
      stackcopyPackageViewState: this.stackcopyPackageView.serialize()
    };
  },

  // toggle() {
  //   console.log('StackcopyPackage was toggled!');
  //   return (
  //     this.modalPanel.isVisible() ?
  //     this.modalPanel.hide() :
  //     this.modalPanel.show()
  //   );
  toggle() {
    let editor
    if(editor = atom.workspace.getActiveTextEditor()){
      let selection = editor.getSelectedText()
      let reversed = selection.split("").reverse().join("")
      editor.insertText(reversed)
    }
  },

  copy(){
    let editor
    if(editor = atom.workspace.getActiveTextEditor()){
      let date = editor.getSelectedText()
      stack.push(date)
      console.log(stack)
    }
  },

  paste(){
    let editor
    if(editor = atom.workspace.getActiveTextEditor()){
      let dateCopied = stack.pop()
      editor.insertText(dateCopied)
      console.log(stack)
    }
  }

};
