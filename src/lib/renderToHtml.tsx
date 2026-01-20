import ReactDOMServer from "react-dom/server";
import FormatTest from "../pages/Invoice/download/Format";
import { TransformedData } from "../types/invoiceTypes";
import fieldNames from "../pages/Invoice/download/fieldNames.json";

interface RenderToHtmlProps {
  transformedData: TransformedData;
}

export function renderToHtml({ transformedData }: RenderToHtmlProps): string {
  return ReactDOMServer.renderToStaticMarkup(
    <FormatTest data={transformedData} fieldNames={fieldNames} />,
  );
}
