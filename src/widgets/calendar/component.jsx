import Container from "components/services/widget/container";
import useWidgetAPI from "utils/proxy/use-widget-api";
import { addDays, format, startOfWeek } from "date-fns";

export default function Component ({ service }) {
  // const { t } = useTranslation();

  const { widget } = service;

  const { data: calendarData, error: calendarError } = useWidgetAPI(widget, widget.format || "day");

  console.log({ calendarData });

  if (calendarError) {
    return <Container service={service} error={calendarError} />;
  }

  if (!calendarData) {
    return (
      <Container service={service}>
        Hello from calendar
      </Container>
    );
  }

  if (widget.format === "week") {
    return (
      <Container service={service}>
        {
          calendarData.map((day, i) => <Container key={i}>
            <div>
              {format(addDays(startOfWeek(new Date()), i), "EEE")}
              <ul>
                {day.map(e => <li key={e.uid}>{e.summary}</li>)}
              </ul>
            </div>
          </Container>)
        }
      </Container>
    );
  }

  return (
    <Container service={service}>
      <ul>
        {
          calendarData.map((ev) => <li key={ev.uid}>{ev.summary}</li>)
        }
      </ul>
      {/* <Block */}
      {/*   label="speedtest.download" */}
      {/*   value={t("common.bitrate", { value: calendarData.data.download * 1000 * 1000 })} */}
      {/* /> */}
      {/* <Block label="speedtest.upload" value={t("common.bitrate", { value: calendarData.data.upload * 1000 * 1000 })} /> */}
      {/* <Block */}
      {/*   label="speedtest.ping" */}
      {/*   value={t("common.ms", { */}
      {/*     value: calendarData.data.ping, */}
      {/*     style: "unit", */}
      {/*     unit: "millisecond", */}
      {/*     unitDisplay: "narrow", */}
      {/*   })} */}
      {/* /> */}
    </Container>
  );
}
