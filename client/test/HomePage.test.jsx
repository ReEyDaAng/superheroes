import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../src/pages/HomePage";

jest.mock("../src/hooks/useSuperheroes.js", () => ({
  useSuperheroes: () => ({
    data: {
      items: [
        { id: "1", nickname: "A", images: [] },
        { id: "2", nickname: "B", images: [] },
      ],
      page: 1,
      totalPages: 2,
    },
    isLoading: false,
    isError: false,
  }),
}));

test('renders list and "Додати героя" button', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

  expect(screen.getByText(/Супергерої/i)).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /додати героя/i })
  ).toBeInTheDocument();
  expect(screen.getAllByText(/Деталі/i).length).toBeGreaterThanOrEqual(2);
});
