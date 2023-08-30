import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@theunigroup/uni-markdown-editor/build/ckeditor';
import React, { useState } from 'react';
import * as uuid from 'uuid';
import './MarkdownEditor.less';

interface MarkdownEditorProps {
  callback: CallableFunction;
  placeHolder: string | undefined;
  data?: string;
  mode: 'create' | 'read-only' | 'edit';
  hiddenImageUpload?: boolean;
}

export const MarkdownEditor = ({
  callback,
  placeHolder,
  data,
  mode,
  hiddenImageUpload,
}: MarkdownEditorProps) => {
  const editorId = uuid.v4();
  const [isPasting, setIsPasting] = useState(false);
  const [isPastingDone, setIsPastingDone] = useState(false);

  const adjustStyles = (editor: any) => {
    const currentContainer = document.getElementById(editorId);
    if (editor && mode === 'read-only') {
      editor.isReadOnly = true;
      if (currentContainer) {
        if (!data) currentContainer.style.display = 'none';

        const toolbars = currentContainer?.querySelectorAll('.ck-sticky-panel__content');
        const containers = currentContainer?.querySelectorAll('.ck-editor__main .ck-content');
        const paragraphs = currentContainer?.querySelectorAll('p');

        const toolbarsArray = Array.prototype.slice.call(toolbars);
        const containersArray = Array.prototype.slice.call(containers);
        const paragraphsArray = Array.prototype.slice.call(paragraphs);

        toolbarsArray.forEach(function (element: any) {
          if (element) {
            element.style.display = 'none';
          }
        });
        containersArray.forEach(function (element: any) {
          if (element) {
            element.style.border = 'none';
            element.style.padding = 0;
          }
        });
        paragraphsArray.forEach(function (element: any) {
          if (element) {
            element.style.margin = 0;
          }
        });
      }
    } else if (editor && mode !== 'read-only') {
      const documentView = editor.editing.view.document;
      documentView.on('paste', (event, data) => {
        setIsPasting(true);
      });

      editor.editing.view.change((writer: any) => {
        writer.setStyle('min-height', '100px', editor.editing.view.document.getRoot());
      });
      const operatorParent = currentContainer?.closest('.operator-remark-history');
      const ckWidths = operatorParent?.querySelectorAll('.markdown-contain');
      const ckWidthsArray = ckWidths ? Array.prototype.slice.call(ckWidths) : [];

      ckWidthsArray.forEach(function (element: any) {
        if (element) {
          element.style.width = operatorParent
            ? `${operatorParent.getBoundingClientRect().width - 5}px`
            : '';
        }
      });
    }
  };

  const onChange = (event: any, e: any) => {
    if (isPastingDone) {
      setIsPastingDone(false);
      return;
    }
    let editorData = e.getData();
    if (isPasting) {
      editorData = editorData.replace(/<!--[^>]*-->/g, '');
      editorData = editorData.replace('\\', '');
      e.setData(editorData);
      setIsPasting(false);
      setIsPastingDone(true);
    }
    callback(editorData);
  };

  let toolbar = [
    'heading',
    '|',
    'bold',
    'italic',
    'strikethrough',
    '|',
    'mention',
    'link',
    'bulletedList',
    'numberedList',
  ];
  if (!hiddenImageUpload) {
    toolbar.push('imageUpload');
  }

  return (
    <div id={editorId} className="markdown-contain">
      <CKEditor
        editor={Editor}
        config={{
          toolbar: toolbar,
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            ],
          },
          placeholder: placeHolder ?? '',
        }}
        data={data}
        onChange={onChange}
        onError={(error: any) => {
          console.log(error);
        }}
        onReady={(editor: any) => adjustStyles(editor)}
      />
    </div>
  );
};
