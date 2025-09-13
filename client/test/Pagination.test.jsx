import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "../src/components/Pagination";

test("disables Prev on first page and calls onChange", async () => {
  const onChange = jest.fn();
  render(<Pagination page={1} totalPages={3} onChange={onChange} />);

  const prev = screen.getByRole("button", { name: /Prev/i });
  const next = screen.getByRole("button", { name: /Next/i });

  expect(prev).toBeDisabled();
  await userEvent.click(next);
  expect(onChange).toHaveBeenCalledWith(2);
});

test("disables Next on last page", () => {
  const onChange = jest.fn();
  render(<Pagination page={3} totalPages={3} onChange={onChange} />);

  expect(screen.getByRole("button", { name: /Next/i })).toBeDisabled();
});
