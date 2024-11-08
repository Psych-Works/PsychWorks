'use client'

// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuGroup, DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuTrigger
// } from "@/components/ui/dropdown-menu";
// import {Button} from "@/components/ui/button";
import {useState} from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export default function CreateAssessmentHeader(){
    const [selectedItem, setSelectedItem] = useState(null);
    // @ts-expect-error type any
    const select = (item) => {
        setSelectedItem(item);
    }
    const types = [ // will get this from server
        {id: 1, value: 'Type 1'},
        {id: 2, value: 'Type 2'},
        {id: 3, value: 'Type 3'}
    ];

    return (
        <>
            <div className="grid grid-cols-5 w-full">
                <div className="col-span-full my-10 text-black text-3xl font-extrabold justify-self-center">
                    Create Assessment Table
                </div>

                <p className={"col-start-2 col-end-3 mx-10 text-black font-extrabold text-xl" +
                    " justify-self-center"}>Table type:</p>
                <p className={'col-start-3 col-end-5 w-full'}>
                    {/*<DropdownMenu>*/}
                    {/*    <DropdownMenuTrigger asChild>*/}
                    {/*        <Button className={'w-full text-lg'}>{selectedItem || 'Select a type'}</Button>*/}
                    {/*    </DropdownMenuTrigger>*/}
                    {/*    <DropdownMenuContent className={"w-56"}>*/}
                    {/*        <DropdownMenuLabel>Table types</DropdownMenuLabel>*/}
                    {/*        <DropdownMenuGroup>*/}
                    {/*            {types.map((item) => (*/}
                    {/*                <DropdownMenuItem key={item.id} textValue={item.value} onSelect={() => select(item.value)}>*/}
                    {/*                    {item.value}*/}
                    {/*                </DropdownMenuItem>*/}
                    {/*            ))}*/}
                    {/*        </DropdownMenuGroup>*/}
                    {/*    </DropdownMenuContent>*/}
                    {/*</DropdownMenu>*/}

                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder={'Select a type'} className={'w-full !text-3xl'}></SelectValue>
                        </SelectTrigger>
                        <SelectContent className={"w-full"}>
                            <SelectGroup>
                                <SelectLabel className={'text-2xl'}>Table types</SelectLabel>
                                {types.map((item) => (
                                    <SelectItem key={item.id} value={item.value} onSelect={() => select(item.value)}>
                                        {item.value}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </p>
            </div>
        </>
    )
}