import ReactDOMServer from 'react-dom/server';
import FormatTest from '../pages/Download/FormatTest';
import { TransformedData } from '../types/invoiceTypes';
import fieldNames from '../pages/Download/fieldNames.json';

interface RenderToHtmlProps {
  transformedData: TransformedData;
}

export function renderToHtml({ transformedData }: RenderToHtmlProps): string {
  return ReactDOMServer.renderToStaticMarkup(
    <FormatTest data={transformedData} fieldNames={fieldNames} />
  );
}
