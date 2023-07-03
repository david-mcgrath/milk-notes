import { AfterViewInit, Component, ElementRef, Input, Output, ViewChild, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CmdKey, defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { replaceAll } from '@milkdown/utils';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { history, undoCommand, redoCommand } from '@milkdown/plugin-history';
import { slashFactory, SlashPlugin, SlashProvider } from '@milkdown/plugin-slash';
import {
  commonmark,
  toggleEmphasisCommand,
  toggleStrongCommand,
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  wrapInHeadingCommand,
} from '@milkdown/preset-commonmark';
import { gfm, insertTableCommand, toggleStrikethroughCommand } from '@milkdown/preset-gfm';
import { nord } from '@milkdown/theme-nord';
import { callCommand } from '@milkdown/utils';
import { EditorView } from '@milkdown/prose/view';
import { EditorState, PluginView } from '@milkdown/prose/state';
import { Ctx } from '@milkdown/ctx';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-milkdown',
  templateUrl: './milkdown.component.html',
  styleUrls: ['./milkdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MilkdownComponent),
      multi: true,
    }
  ],
  imports: [IonicModule],
})
export class MilkdownComponent  implements AfterViewInit, ControlValueAccessor {
  @ViewChild('editorRef') editorRef!: ElementRef;
  editor?: Editor;

  @Input() ngModel = '';
  @Output() ngModelChange = new EventEmitter<string>();
  @Output() focus = new EventEmitter();
  @Output() blur = new EventEmitter();
  onChange: (_: unknown) => void = () => {};
  onTouched: () => void = () => {};

  private disabled: boolean = false;
  private initialised: boolean = false;

  focused: boolean = false;

  constructor() { }
  writeValue(value: string): void {
    this.ngModel = value;
    if (this.initialised) {
      if (this.editor) {
        replaceAll(this.ngModel)(this.editor.ctx);
      }
    }
  }
  registerOnChange(fn: (_: unknown) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngAfterViewInit(): void {
    this.init();
  }
  private init(): void {
    if (this.editor) {
      this.editor.destroy();
    }
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, this.editorRef.nativeElement);
        ctx.set(defaultValueCtx, this.ngModel || '');
        ctx.get(listenerCtx).markdownUpdated((_, md) => {
          this.ngModel = md;
          if (this.initialised) {
            this.onChange(md);
            this.ngModelChange.next(md);
          }
        });
        ctx.get(listenerCtx).focus(() => this.onFocus());
        ctx.get(listenerCtx).blur(() => this.onBlur());
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(listener)
      .use(history)
      .create()
      .then((editor) => {
        this.editor = editor;
        replaceAll(this.ngModel || '')(this.editor.ctx);
        this.initialised = true;
      })
  }

  onFocus(): void {
    this.focused = true;
    console.log('focused');
    this.focus.emit();
  }
  onBlur(): void {
    this.focused = false;
    console.log('blur');
    this.blur.emit();
  }
}
