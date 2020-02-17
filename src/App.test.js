import React from "react";
import * as rtl from "@testing-library/react";
import App from "./App";
import axios from "axios";

jest.mock("axios", () => {
  return {
    get: jest.fn(() =>
      Promise.resolve({
        data: {
          query: {
            pages: {
              12345: {
                title: "page title",
                pageviews: {
                  "2019-02-01": 123
                },
                links: [{ title: "next page title" }]
              }
            }
          }
        }
      })
    )
  };
});

test("clicking next calls api", async () => {
  const wrapper = rtl.render(<App />);
  await wrapper.findAllByTestId("pageview-count");
  const result =
    "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=info|pageviews|links&titles=next%20page%20title&origin=*";

  const next = wrapper.getByText(/next/i);

  rtl.act(() => {
    rtl.fireEvent.click(next);
  });

  await wrapper.findAllByTestId("pageview-count");

  expect(axios.get).toHaveBeenLastCalledWith(result);
});
