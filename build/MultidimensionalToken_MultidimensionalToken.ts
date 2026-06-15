import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadTupleChangeOwner(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadGetterTupleChangeOwner(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function storeTupleChangeOwner(source: ChangeOwner) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

export function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwnerOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadTupleChangeOwnerOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadGetterTupleChangeOwnerOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

export function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
        }
    }
}

export type SplitMsg = {
    $$type: 'SplitMsg';
    amount1: bigint;
    amount2: bigint;
}

export function storeSplitMsg(src: SplitMsg) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2299018334, 32);
        b_0.storeInt(src.amount1, 257);
        b_0.storeInt(src.amount2, 257);
    };
}

export function loadSplitMsg(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2299018334) { throw Error('Invalid prefix'); }
    const _amount1 = sc_0.loadIntBig(257);
    const _amount2 = sc_0.loadIntBig(257);
    return { $$type: 'SplitMsg' as const, amount1: _amount1, amount2: _amount2 };
}

export function loadTupleSplitMsg(source: TupleReader) {
    const _amount1 = source.readBigNumber();
    const _amount2 = source.readBigNumber();
    return { $$type: 'SplitMsg' as const, amount1: _amount1, amount2: _amount2 };
}

export function loadGetterTupleSplitMsg(source: TupleReader) {
    const _amount1 = source.readBigNumber();
    const _amount2 = source.readBigNumber();
    return { $$type: 'SplitMsg' as const, amount1: _amount1, amount2: _amount2 };
}

export function storeTupleSplitMsg(source: SplitMsg) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount1);
    builder.writeNumber(source.amount2);
    return builder.build();
}

export function dictValueParserSplitMsg(): DictionaryValue<SplitMsg> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSplitMsg(src)).endCell());
        },
        parse: (src) => {
            return loadSplitMsg(src.loadRef().beginParse());
        }
    }
}

export type UpdateQualityMsg = {
    $$type: 'UpdateQualityMsg';
    quality_score: bigint;
    audit_status: bigint;
}

export function storeUpdateQualityMsg(src: UpdateQualityMsg) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3272362233, 32);
        b_0.storeInt(src.quality_score, 257);
        b_0.storeInt(src.audit_status, 257);
    };
}

export function loadUpdateQualityMsg(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3272362233) { throw Error('Invalid prefix'); }
    const _quality_score = sc_0.loadIntBig(257);
    const _audit_status = sc_0.loadIntBig(257);
    return { $$type: 'UpdateQualityMsg' as const, quality_score: _quality_score, audit_status: _audit_status };
}

export function loadTupleUpdateQualityMsg(source: TupleReader) {
    const _quality_score = source.readBigNumber();
    const _audit_status = source.readBigNumber();
    return { $$type: 'UpdateQualityMsg' as const, quality_score: _quality_score, audit_status: _audit_status };
}

export function loadGetterTupleUpdateQualityMsg(source: TupleReader) {
    const _quality_score = source.readBigNumber();
    const _audit_status = source.readBigNumber();
    return { $$type: 'UpdateQualityMsg' as const, quality_score: _quality_score, audit_status: _audit_status };
}

export function storeTupleUpdateQualityMsg(source: UpdateQualityMsg) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.quality_score);
    builder.writeNumber(source.audit_status);
    return builder.build();
}

export function dictValueParserUpdateQualityMsg(): DictionaryValue<UpdateQualityMsg> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUpdateQualityMsg(src)).endCell());
        },
        parse: (src) => {
            return loadUpdateQualityMsg(src.loadRef().beginParse());
        }
    }
}

export type UpdateLegalMsg = {
    $$type: 'UpdateLegalMsg';
    legal_status: bigint;
    compliance_hash: bigint;
}

export function storeUpdateLegalMsg(src: UpdateLegalMsg) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1963855621, 32);
        b_0.storeInt(src.legal_status, 257);
        b_0.storeInt(src.compliance_hash, 257);
    };
}

export function loadUpdateLegalMsg(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1963855621) { throw Error('Invalid prefix'); }
    const _legal_status = sc_0.loadIntBig(257);
    const _compliance_hash = sc_0.loadIntBig(257);
    return { $$type: 'UpdateLegalMsg' as const, legal_status: _legal_status, compliance_hash: _compliance_hash };
}

export function loadTupleUpdateLegalMsg(source: TupleReader) {
    const _legal_status = source.readBigNumber();
    const _compliance_hash = source.readBigNumber();
    return { $$type: 'UpdateLegalMsg' as const, legal_status: _legal_status, compliance_hash: _compliance_hash };
}

export function loadGetterTupleUpdateLegalMsg(source: TupleReader) {
    const _legal_status = source.readBigNumber();
    const _compliance_hash = source.readBigNumber();
    return { $$type: 'UpdateLegalMsg' as const, legal_status: _legal_status, compliance_hash: _compliance_hash };
}

export function storeTupleUpdateLegalMsg(source: UpdateLegalMsg) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.legal_status);
    builder.writeNumber(source.compliance_hash);
    return builder.build();
}

export function dictValueParserUpdateLegalMsg(): DictionaryValue<UpdateLegalMsg> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUpdateLegalMsg(src)).endCell());
        },
        parse: (src) => {
            return loadUpdateLegalMsg(src.loadRef().beginParse());
        }
    }
}

export type IdentityRoot = {
    $$type: 'IdentityRoot';
    token_id: bigint;
    owner: Address;
    minter: Address;
    created_at: bigint;
}

export function storeIdentityRoot(src: IdentityRoot) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.token_id, 257);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.minter);
        const b_1 = new Builder();
        b_1.storeInt(src.created_at, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadIdentityRoot(slice: Slice) {
    const sc_0 = slice;
    const _token_id = sc_0.loadIntBig(257);
    const _owner = sc_0.loadAddress();
    const _minter = sc_0.loadAddress();
    const sc_1 = sc_0.loadRef().beginParse();
    const _created_at = sc_1.loadIntBig(257);
    return { $$type: 'IdentityRoot' as const, token_id: _token_id, owner: _owner, minter: _minter, created_at: _created_at };
}

export function loadTupleIdentityRoot(source: TupleReader) {
    const _token_id = source.readBigNumber();
    const _owner = source.readAddress();
    const _minter = source.readAddress();
    const _created_at = source.readBigNumber();
    return { $$type: 'IdentityRoot' as const, token_id: _token_id, owner: _owner, minter: _minter, created_at: _created_at };
}

export function loadGetterTupleIdentityRoot(source: TupleReader) {
    const _token_id = source.readBigNumber();
    const _owner = source.readAddress();
    const _minter = source.readAddress();
    const _created_at = source.readBigNumber();
    return { $$type: 'IdentityRoot' as const, token_id: _token_id, owner: _owner, minter: _minter, created_at: _created_at };
}

export function storeTupleIdentityRoot(source: IdentityRoot) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.token_id);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.minter);
    builder.writeNumber(source.created_at);
    return builder.build();
}

export function dictValueParserIdentityRoot(): DictionaryValue<IdentityRoot> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeIdentityRoot(src)).endCell());
        },
        parse: (src) => {
            return loadIdentityRoot(src.loadRef().beginParse());
        }
    }
}

export type StateRoot = {
    $$type: 'StateRoot';
    is_active: boolean;
    generation: bigint;
    parent_id: bigint;
    total_supply: bigint;
}

export function storeStateRoot(src: StateRoot) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.is_active);
        b_0.storeInt(src.generation, 257);
        b_0.storeInt(src.parent_id, 257);
        b_0.storeInt(src.total_supply, 257);
    };
}

export function loadStateRoot(slice: Slice) {
    const sc_0 = slice;
    const _is_active = sc_0.loadBit();
    const _generation = sc_0.loadIntBig(257);
    const _parent_id = sc_0.loadIntBig(257);
    const _total_supply = sc_0.loadIntBig(257);
    return { $$type: 'StateRoot' as const, is_active: _is_active, generation: _generation, parent_id: _parent_id, total_supply: _total_supply };
}

export function loadTupleStateRoot(source: TupleReader) {
    const _is_active = source.readBoolean();
    const _generation = source.readBigNumber();
    const _parent_id = source.readBigNumber();
    const _total_supply = source.readBigNumber();
    return { $$type: 'StateRoot' as const, is_active: _is_active, generation: _generation, parent_id: _parent_id, total_supply: _total_supply };
}

export function loadGetterTupleStateRoot(source: TupleReader) {
    const _is_active = source.readBoolean();
    const _generation = source.readBigNumber();
    const _parent_id = source.readBigNumber();
    const _total_supply = source.readBigNumber();
    return { $$type: 'StateRoot' as const, is_active: _is_active, generation: _generation, parent_id: _parent_id, total_supply: _total_supply };
}

export function storeTupleStateRoot(source: StateRoot) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.is_active);
    builder.writeNumber(source.generation);
    builder.writeNumber(source.parent_id);
    builder.writeNumber(source.total_supply);
    return builder.build();
}

export function dictValueParserStateRoot(): DictionaryValue<StateRoot> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateRoot(src)).endCell());
        },
        parse: (src) => {
            return loadStateRoot(src.loadRef().beginParse());
        }
    }
}

export type QualityRoot = {
    $$type: 'QualityRoot';
    quality_score: bigint;
    audit_status: bigint;
    verification_count: bigint;
}

export function storeQualityRoot(src: QualityRoot) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.quality_score, 257);
        b_0.storeInt(src.audit_status, 257);
        b_0.storeInt(src.verification_count, 257);
    };
}

export function loadQualityRoot(slice: Slice) {
    const sc_0 = slice;
    const _quality_score = sc_0.loadIntBig(257);
    const _audit_status = sc_0.loadIntBig(257);
    const _verification_count = sc_0.loadIntBig(257);
    return { $$type: 'QualityRoot' as const, quality_score: _quality_score, audit_status: _audit_status, verification_count: _verification_count };
}

export function loadTupleQualityRoot(source: TupleReader) {
    const _quality_score = source.readBigNumber();
    const _audit_status = source.readBigNumber();
    const _verification_count = source.readBigNumber();
    return { $$type: 'QualityRoot' as const, quality_score: _quality_score, audit_status: _audit_status, verification_count: _verification_count };
}

export function loadGetterTupleQualityRoot(source: TupleReader) {
    const _quality_score = source.readBigNumber();
    const _audit_status = source.readBigNumber();
    const _verification_count = source.readBigNumber();
    return { $$type: 'QualityRoot' as const, quality_score: _quality_score, audit_status: _audit_status, verification_count: _verification_count };
}

export function storeTupleQualityRoot(source: QualityRoot) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.quality_score);
    builder.writeNumber(source.audit_status);
    builder.writeNumber(source.verification_count);
    return builder.build();
}

export function dictValueParserQualityRoot(): DictionaryValue<QualityRoot> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeQualityRoot(src)).endCell());
        },
        parse: (src) => {
            return loadQualityRoot(src.loadRef().beginParse());
        }
    }
}

export type LegalRoot = {
    $$type: 'LegalRoot';
    legal_status: bigint;
    compliance_hash: bigint;
    jurisdiction_code: bigint;
}

export function storeLegalRoot(src: LegalRoot) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.legal_status, 257);
        b_0.storeInt(src.compliance_hash, 257);
        b_0.storeInt(src.jurisdiction_code, 257);
    };
}

export function loadLegalRoot(slice: Slice) {
    const sc_0 = slice;
    const _legal_status = sc_0.loadIntBig(257);
    const _compliance_hash = sc_0.loadIntBig(257);
    const _jurisdiction_code = sc_0.loadIntBig(257);
    return { $$type: 'LegalRoot' as const, legal_status: _legal_status, compliance_hash: _compliance_hash, jurisdiction_code: _jurisdiction_code };
}

export function loadTupleLegalRoot(source: TupleReader) {
    const _legal_status = source.readBigNumber();
    const _compliance_hash = source.readBigNumber();
    const _jurisdiction_code = source.readBigNumber();
    return { $$type: 'LegalRoot' as const, legal_status: _legal_status, compliance_hash: _compliance_hash, jurisdiction_code: _jurisdiction_code };
}

export function loadGetterTupleLegalRoot(source: TupleReader) {
    const _legal_status = source.readBigNumber();
    const _compliance_hash = source.readBigNumber();
    const _jurisdiction_code = source.readBigNumber();
    return { $$type: 'LegalRoot' as const, legal_status: _legal_status, compliance_hash: _compliance_hash, jurisdiction_code: _jurisdiction_code };
}

export function storeTupleLegalRoot(source: LegalRoot) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.legal_status);
    builder.writeNumber(source.compliance_hash);
    builder.writeNumber(source.jurisdiction_code);
    return builder.build();
}

export function dictValueParserLegalRoot(): DictionaryValue<LegalRoot> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLegalRoot(src)).endCell());
        },
        parse: (src) => {
            return loadLegalRoot(src.loadRef().beginParse());
        }
    }
}

export type LineageRoot = {
    $$type: 'LineageRoot';
    lineage_depth: bigint;
    split_count: bigint;
}

export function storeLineageRoot(src: LineageRoot) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.lineage_depth, 257);
        b_0.storeInt(src.split_count, 257);
    };
}

export function loadLineageRoot(slice: Slice) {
    const sc_0 = slice;
    const _lineage_depth = sc_0.loadIntBig(257);
    const _split_count = sc_0.loadIntBig(257);
    return { $$type: 'LineageRoot' as const, lineage_depth: _lineage_depth, split_count: _split_count };
}

export function loadTupleLineageRoot(source: TupleReader) {
    const _lineage_depth = source.readBigNumber();
    const _split_count = source.readBigNumber();
    return { $$type: 'LineageRoot' as const, lineage_depth: _lineage_depth, split_count: _split_count };
}

export function loadGetterTupleLineageRoot(source: TupleReader) {
    const _lineage_depth = source.readBigNumber();
    const _split_count = source.readBigNumber();
    return { $$type: 'LineageRoot' as const, lineage_depth: _lineage_depth, split_count: _split_count };
}

export function storeTupleLineageRoot(source: LineageRoot) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.lineage_depth);
    builder.writeNumber(source.split_count);
    return builder.build();
}

export function dictValueParserLineageRoot(): DictionaryValue<LineageRoot> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLineageRoot(src)).endCell());
        },
        parse: (src) => {
            return loadLineageRoot(src.loadRef().beginParse());
        }
    }
}

export type MultidimensionalToken$Data = {
    $$type: 'MultidimensionalToken$Data';
    owner: Address;
    identity: IdentityRoot;
    state: StateRoot;
    quality: QualityRoot;
    legal: LegalRoot;
    lineage: LineageRoot;
    last_update: bigint;
}

export function storeMultidimensionalToken$Data(src: MultidimensionalToken$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        const b_1 = new Builder();
        b_1.store(storeIdentityRoot(src.identity));
        const b_2 = new Builder();
        b_2.store(storeStateRoot(src.state));
        const b_3 = new Builder();
        b_3.store(storeQualityRoot(src.quality));
        const b_4 = new Builder();
        b_4.store(storeLegalRoot(src.legal));
        const b_5 = new Builder();
        b_5.store(storeLineageRoot(src.lineage));
        b_5.storeInt(src.last_update, 257);
        b_4.storeRef(b_5.endCell());
        b_3.storeRef(b_4.endCell());
        b_2.storeRef(b_3.endCell());
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadMultidimensionalToken$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const sc_1 = sc_0.loadRef().beginParse();
    const _identity = loadIdentityRoot(sc_1);
    const sc_2 = sc_1.loadRef().beginParse();
    const _state = loadStateRoot(sc_2);
    const sc_3 = sc_2.loadRef().beginParse();
    const _quality = loadQualityRoot(sc_3);
    const sc_4 = sc_3.loadRef().beginParse();
    const _legal = loadLegalRoot(sc_4);
    const sc_5 = sc_4.loadRef().beginParse();
    const _lineage = loadLineageRoot(sc_5);
    const _last_update = sc_5.loadIntBig(257);
    return { $$type: 'MultidimensionalToken$Data' as const, owner: _owner, identity: _identity, state: _state, quality: _quality, legal: _legal, lineage: _lineage, last_update: _last_update };
}

export function loadTupleMultidimensionalToken$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _identity = loadTupleIdentityRoot(source);
    const _state = loadTupleStateRoot(source);
    const _quality = loadTupleQualityRoot(source);
    const _legal = loadTupleLegalRoot(source);
    const _lineage = loadTupleLineageRoot(source);
    const _last_update = source.readBigNumber();
    return { $$type: 'MultidimensionalToken$Data' as const, owner: _owner, identity: _identity, state: _state, quality: _quality, legal: _legal, lineage: _lineage, last_update: _last_update };
}

export function loadGetterTupleMultidimensionalToken$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _identity = loadGetterTupleIdentityRoot(source);
    const _state = loadGetterTupleStateRoot(source);
    const _quality = loadGetterTupleQualityRoot(source);
    const _legal = loadGetterTupleLegalRoot(source);
    const _lineage = loadGetterTupleLineageRoot(source);
    const _last_update = source.readBigNumber();
    return { $$type: 'MultidimensionalToken$Data' as const, owner: _owner, identity: _identity, state: _state, quality: _quality, legal: _legal, lineage: _lineage, last_update: _last_update };
}

export function storeTupleMultidimensionalToken$Data(source: MultidimensionalToken$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeTuple(storeTupleIdentityRoot(source.identity));
    builder.writeTuple(storeTupleStateRoot(source.state));
    builder.writeTuple(storeTupleQualityRoot(source.quality));
    builder.writeTuple(storeTupleLegalRoot(source.legal));
    builder.writeTuple(storeTupleLineageRoot(source.lineage));
    builder.writeNumber(source.last_update);
    return builder.build();
}

export function dictValueParserMultidimensionalToken$Data(): DictionaryValue<MultidimensionalToken$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMultidimensionalToken$Data(src)).endCell());
        },
        parse: (src) => {
            return loadMultidimensionalToken$Data(src.loadRef().beginParse());
        }
    }
}

 type MultidimensionalToken_init_args = {
    $$type: 'MultidimensionalToken_init_args';
    token_id: bigint;
    owner: Address;
    minter: Address;
    total_supply: bigint;
    generation: bigint;
    parent_id: bigint;
}

function initMultidimensionalToken_init_args(src: MultidimensionalToken_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.token_id, 257);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.minter);
        const b_1 = new Builder();
        b_1.storeInt(src.total_supply, 257);
        b_1.storeInt(src.generation, 257);
        b_1.storeInt(src.parent_id, 257);
        b_0.storeRef(b_1.endCell());
    };
}

async function MultidimensionalToken_init(token_id: bigint, owner: Address, minter: Address, total_supply: bigint, generation: bigint, parent_id: bigint) {
    const __code = Cell.fromHex('b5ee9c7241023401000ab4000114ff00f4a413f4bcf2c80b01020162020b0130d001d072d721d200d200fa4021103450666f04f86102f8620302fced44d0d200018e90db3c57121110111111100f11100f550e8e5b810101d700fa40fa40d401d0810101d700810101d700810101d7003010361035103406d15504f823542655257f5445371a806470207053000c701110111111100c11100c5e3b10cd10ac109b108a10791068105710461035410403e21113945f0f5f04e0300403fe1111d70d1ff2e08221821089083c5ebae302218210c30c48f9ba8ee2313636571003810101d700810101d700308200c13df8425610c705f2f481494822c2ff9322c1659170e2f2f403a4f8230f11110f0e11100e10df10ce10bd10ac109b108a107910281047161035103412c87f01ca0011121111111055e0db3cc9ed54e005090701fe31810101d700810101d700308200da1af8425613c705f2f482008260500df2f48200b17e21c200932cc2009170e2f2f48135e8531ca02abaf2f4f823011113a18200ad5c018208278d00b9f2f4701111a4f823820898968071c85210cb1f561301ca3f01111601ca3f1eca3f2ca401ca1fc956124e131115015a6d6d40037f0601a4c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb000f11110f0e11100e10df10ce10bd5519c87f01ca0011121111111055e0db3cc9ed540902d8218210750e0f05ba8ed03133335710810101d700810101d700308200c13df8425610c705f2f4f8230f11110f0e11100e10df10ce10bd10ac109b108a107910681057104645401023c87f01ca0011121111111055e0db3cc9ed54e0018210946a98b6bae3025f0f5f04f2c082090801dad33f30c8018210aff90f5758cb1fcb3fc91110111211100f11110f0e11100e10df10ce10bd10ac109b108a10791068105710461035443012f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00c87f01ca0011121111111055e0db3cc9ed540901f6011111011112cec804031110034fed5034810101cf00cece01c8810101cf00cdc804103948765034ca00810101cf00810101cf00810101cf00c85033065023810101cf00810101cf00810101cf00c8431350585023810101cf00810101cf00810101cf00c8405702810101cf00810101cf0016810101cf0012cd140a000acd12cdcdcd0201200c170201200d120201580e1003f9b3febb513434800063a436cf15c484440444444403c44403d543a396e0404075c03e903e9035007420404075c020404075c020404075c00c040d840d440d01b455413e08d50995495fd5114dc6a0191c081c14c0031c04440444444403044403178ec433442b0426c422841e441a0415c411840d504100f8b6cf15c420300f2b002cf82321a1208208278d00be923070e08208278d0001a103f9b1cfbb513434800063a436cf15c484440444444403c44403d543a396e0404075c03e903e9035007420404075c020404075c020404075c00c040d840d440d01b455413e08d50995495fd5114dc6a0191c081c14c0031c04440444444403044403178ec433442b0426c422841e441a0415c411840d504100f8b6cf1b3ce030112100065475430201c7131503f8ab6eed44d0d200018e90db3c57121110111111100f11100f550e8e5b810101d700fa40fa40d401d0810101d700810101d700810101d7003010361035103406d15504f823542655257f5445371a806470207053000c701110111111100c11100c5e3b10cd10ac109b108a10791068105710461035410403e2db3c571030142b00022c03f8a91ded44d0d200018e90db3c57121110111111100f11100f550e8e5b810101d700fa40fa40d401d0810101d700810101d700810101d7003010361035103406d15504f823542655257f5445371a806470207053000c701110111111100c11100c5e3b10cd10ac109b108a10791068105710461035410403e2db3c571030162b000456110201201824020120191b03f9b44c5da89a1a400031d21b678ae242220222222201e22201eaa1d1cb7020203ae01f481f481a803a1020203ae01020203ae01020203ae0060206c206a20680da2aa09f046a84caa4afea88a6e3500c8e040e0a60018e022202222222018222018bc76219a21582136211420f220d020ae208c206a820807c5b678ae210301a2b0002290201581c1e03f9ae3576a268690000c7486d9e2b8908880888888807888807aa87472dc08080eb807d207d206a00e8408080eb80408080eb80408080eb8018081b081a881a0368aa827c11aa132a92bfaa229b8d403238103829800638088808888888060888062f1d88668856084d8845083c8834082b8823081aa08201f16d9e2b8840301d2b00022b0201201f2203f8a8baed44d0d200018e90db3c57121110111111100f11100f550e8e5b810101d700fa40fa40d401d0810101d700810101d700810101d7003010361035103406d15504f823542655257f5445371a806470207053000c701110111111100c11100c5e3b10cd10ac109b108a10791068105710461035410403e2db3c6cf3302021000654787600046c3303f8aad1ed44d0d200018e90db3c57121110111111100f11100f550e8e5b810101d700fa40fa40d401d0810101d700810101d700810101d7003010361035103406d15504f823542655257f5445371a806470207053000c701110111111100c11100c5e3b10cd10ac109b108a10791068105710461035410403e2db3c571030232b0014f82321a18208278d00be020120252f020166262c020148272903f7a1d3b513434800063a436cf15c484440444444403c44403d543a396e0404075c03e903e9035007420404075c020404075c020404075c00c040d840d440d01b455413e08d50995495fd5114dc6a0191c081c14c0031c04440444444403044403178ec433442b0426c422841e441a0415c411840d504100f8b6cf1b3123028330010561056105610561003f7a15bb513434800063a436cf15c484440444444403c44403d543a396e0404075c03e903e9035007420404075c020404075c020404075c00c040d840d440d01b455413e08d50995495fd5114dc6a0191c081c14c0031c04440444444403044403178ec433442b0426c422841e441a0415c411840d504100f8b6cf15c42302a2b0008f82321a100085f0f6c2103f8aa1eed44d0d200018e90db3c57121110111111100f11100f550e8e5b810101d700fa40fa40d401d0810101d700810101d700810101d7003010361035103406d15504f823542655257f5445371a806470207053000c701110111111100c11100c5e3b10cd10ac109b108a10791068105710461035410403e2db3c5712302d2e00045321000a57105f0f3203f9b4903da89a1a400031d21b678ae242220222222201e22201eaa1d1cb7020203ae01f481f481a803a1020203ae01020203ae01020203ae0060206c206a20680da2aa09f046a84caa4afea88a6e3500c8e040e0a60018e022202222222018222018bc76219a21582136211420f220d020ae208c206a820807c5b678d989030323301f6fa40d401d0810101d700fa40fa40d401d0810101d7003014433004d430d0d200810101d700810101d700810101d700553004d430d0810101d700810101d700810101d700552003d430d0810101d700810101d700810101d700552003d430d0810101d700810101d7005902810101d700301111111211110f11100f31002610ef10de10bc10ab109a1078106710451034120008547cba2c00046c640e083a06');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initMultidimensionalToken_init_args({ $$type: 'MultidimensionalToken_init_args', token_id, owner, minter, total_supply, generation, parent_id })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const MultidimensionalToken_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    13800: { message: "Split amounts must equal total supply" },
    18760: { message: "Quality score must be 0-100" },
    33376: { message: "Token is burned" },
    44380: { message: "Token is STALE" },
    45438: { message: "Below minimum dust limit" },
    49469: { message: "Access denied" },
    55834: { message: "Only owner can initiate split" },
} as const

export const MultidimensionalToken_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Split amounts must equal total supply": 13800,
    "Quality score must be 0-100": 18760,
    "Token is burned": 33376,
    "Token is STALE": 44380,
    "Below minimum dust limit": 45438,
    "Access denied": 49469,
    "Only owner can initiate split": 55834,
} as const

const MultidimensionalToken_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwner","header":2174598809,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwnerOk","header":846932810,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SplitMsg","header":2299018334,"fields":[{"name":"amount1","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"amount2","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"UpdateQualityMsg","header":3272362233,"fields":[{"name":"quality_score","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"audit_status","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"UpdateLegalMsg","header":1963855621,"fields":[{"name":"legal_status","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"compliance_hash","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"IdentityRoot","header":null,"fields":[{"name":"token_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"minter","type":{"kind":"simple","type":"address","optional":false}},{"name":"created_at","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"StateRoot","header":null,"fields":[{"name":"is_active","type":{"kind":"simple","type":"bool","optional":false}},{"name":"generation","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"parent_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"total_supply","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"QualityRoot","header":null,"fields":[{"name":"quality_score","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"audit_status","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"verification_count","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"LegalRoot","header":null,"fields":[{"name":"legal_status","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"compliance_hash","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"jurisdiction_code","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"LineageRoot","header":null,"fields":[{"name":"lineage_depth","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"split_count","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"MultidimensionalToken$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"identity","type":{"kind":"simple","type":"IdentityRoot","optional":false}},{"name":"state","type":{"kind":"simple","type":"StateRoot","optional":false}},{"name":"quality","type":{"kind":"simple","type":"QualityRoot","optional":false}},{"name":"legal","type":{"kind":"simple","type":"LegalRoot","optional":false}},{"name":"lineage","type":{"kind":"simple","type":"LineageRoot","optional":false}},{"name":"last_update","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
]

const MultidimensionalToken_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "ChangeOwner": 2174598809,
    "ChangeOwnerOk": 846932810,
    "SplitMsg": 2299018334,
    "UpdateQualityMsg": 3272362233,
    "UpdateLegalMsg": 1963855621,
}

const MultidimensionalToken_getters: ABIGetter[] = [
    {"name":"getState","methodId":124033,"arguments":[],"returnType":{"kind":"simple","type":"StateRoot","optional":false}},
    {"name":"getIdentity","methodId":116852,"arguments":[],"returnType":{"kind":"simple","type":"IdentityRoot","optional":false}},
    {"name":"getQuality","methodId":112826,"arguments":[],"returnType":{"kind":"simple","type":"QualityRoot","optional":false}},
    {"name":"getLegal","methodId":79678,"arguments":[],"returnType":{"kind":"simple","type":"LegalRoot","optional":false}},
    {"name":"getLineage","methodId":118302,"arguments":[],"returnType":{"kind":"simple","type":"LineageRoot","optional":false}},
    {"name":"isStale","methodId":114385,"arguments":[],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"getTimeSinceLastUpdate","methodId":117078,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getTimeUntilStale","methodId":77818,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"isActive","methodId":82798,"arguments":[],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"getGeneration","methodId":111722,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getTotalSupply","methodId":98914,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"owner","methodId":83229,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

export const MultidimensionalToken_getterMapping: { [key: string]: string } = {
    'getState': 'getGetState',
    'getIdentity': 'getGetIdentity',
    'getQuality': 'getGetQuality',
    'getLegal': 'getGetLegal',
    'getLineage': 'getGetLineage',
    'isStale': 'getIsStale',
    'getTimeSinceLastUpdate': 'getGetTimeSinceLastUpdate',
    'getTimeUntilStale': 'getGetTimeUntilStale',
    'isActive': 'getIsActive',
    'getGeneration': 'getGetGeneration',
    'getTotalSupply': 'getGetTotalSupply',
    'owner': 'getOwner',
}

const MultidimensionalToken_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"SplitMsg"}},
    {"receiver":"internal","message":{"kind":"typed","type":"UpdateQualityMsg"}},
    {"receiver":"internal","message":{"kind":"typed","type":"UpdateLegalMsg"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]


export class MultidimensionalToken implements Contract {
    
    public static readonly STALE_THRESHOLD = 2592000n;
    public static readonly MIN_SPLIT_AMOUNT = 1n;
    public static readonly OP_SPLIT_EVENT = 1n;
    public static readonly storageReserve = 0n;
    public static readonly errors = MultidimensionalToken_errors_backward;
    public static readonly opcodes = MultidimensionalToken_opcodes;
    
    static async init(token_id: bigint, owner: Address, minter: Address, total_supply: bigint, generation: bigint, parent_id: bigint) {
        return await MultidimensionalToken_init(token_id, owner, minter, total_supply, generation, parent_id);
    }
    
    static async fromInit(token_id: bigint, owner: Address, minter: Address, total_supply: bigint, generation: bigint, parent_id: bigint) {
        const __gen_init = await MultidimensionalToken_init(token_id, owner, minter, total_supply, generation, parent_id);
        const address = contractAddress(0, __gen_init);
        return new MultidimensionalToken(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new MultidimensionalToken(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  MultidimensionalToken_types,
        getters: MultidimensionalToken_getters,
        receivers: MultidimensionalToken_receivers,
        errors: MultidimensionalToken_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: SplitMsg | UpdateQualityMsg | UpdateLegalMsg | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SplitMsg') {
            body = beginCell().store(storeSplitMsg(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'UpdateQualityMsg') {
            body = beginCell().store(storeUpdateQualityMsg(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'UpdateLegalMsg') {
            body = beginCell().store(storeUpdateLegalMsg(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetState(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getState', builder.build())).stack;
        const result = loadGetterTupleStateRoot(source);
        return result;
    }
    
    async getGetIdentity(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getIdentity', builder.build())).stack;
        const result = loadGetterTupleIdentityRoot(source);
        return result;
    }
    
    async getGetQuality(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getQuality', builder.build())).stack;
        const result = loadGetterTupleQualityRoot(source);
        return result;
    }
    
    async getGetLegal(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getLegal', builder.build())).stack;
        const result = loadGetterTupleLegalRoot(source);
        return result;
    }
    
    async getGetLineage(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getLineage', builder.build())).stack;
        const result = loadGetterTupleLineageRoot(source);
        return result;
    }
    
    async getIsStale(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('isStale', builder.build())).stack;
        const result = source.readBoolean();
        return result;
    }
    
    async getGetTimeSinceLastUpdate(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getTimeSinceLastUpdate', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetTimeUntilStale(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getTimeUntilStale', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getIsActive(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('isActive', builder.build())).stack;
        const result = source.readBoolean();
        return result;
    }
    
    async getGetGeneration(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getGeneration', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetTotalSupply(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getTotalSupply', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getOwner(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('owner', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
}