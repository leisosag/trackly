import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const PlusDropdown = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="!bg-pink-600 hover:bg-pink-700 !rounded-full p-3 text-white flex items-center justify-center w-12 h-12">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="bg-gray-800 text-white rounded shadow-lg p-2">
        <DropdownMenu.Item
          className="px-4 py-2 rounded hover:bg-pink-400 hover:text-gray-900 cursor-pointer"
          onSelect={() => alert("efectivo")}
        >
          Gasto en efectivo
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="px-4 py-2 rounded hover:bg-pink-400 hover:text-gray-900 cursor-pointer"
          onSelect={() => alert("tarjeta")}
        >
          Compra con tarjeta
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default PlusDropdown;
