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
    const types = [ // will get this from the DB
        {id: 1, name: 'Type 1', description: 'Description 1', created_at: null, updated_at: null},
        {id: 2, name: 'Type 2', description: 'Description 2', created_at: null, updated_at: null},
        {id: 3, name: 'Type 3', description: 'Description 3', created_at: null, updated_at: null},
    ];

    return (
        <>
            <div className="grid grid-cols-5 w-full">
                <div className="col-span-full my-10 text-black text-3xl font-extrabold justify-self-center">
                    Create Assessment Table
                </div>

                <p className="col-start-2 col-end-3 mx-10 text-black font-extrabold text-xl justify-self-center">Table type:</p>
                <p className='col-start-3 col-end-5 w-full'>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder='Select a type' className='w-full !text-3xl'></SelectValue>
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectGroup>
                                <SelectLabel className='text-2xl'>Table types</SelectLabel>
                                {types.map((item) => (
                                    <SelectItem key={item.id} value={item.name}>
                                        {item.name}
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