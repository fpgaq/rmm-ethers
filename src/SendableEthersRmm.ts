// --- Receipt Types ---

import { EthersTransactionReceipt, EthersTransactionResponse, PopulatableEthersRmm } from '.'

/**
 * Indicates that the transaction hasn't been mined yet.
 *
 * @remarks
 * Returned by {@link SentRmmTransaction.getReceipt}.
 *
 * @public
 */
export type PendingReceipt = { status: 'pending' }

/** @internal */
export const _pendingReceipt: PendingReceipt = { status: 'pending' }

/**
 * Indicates that the transaction has been mined, but it failed.
 *
 * @remarks
 * The `rawReceipt` property is an implementation-specific transaction receipt object.
 *
 * Returned by {@link SentRmmTransaction.getReceipt} and
 * {@link SentRmmTransaction.waitForReceipt}.
 *
 * @public
 */
export type FailedReceipt<R = unknown> = { status: 'failed'; rawReceipt: R }

/** @internal */
export const _failedReceipt = <R>(rawReceipt: R): FailedReceipt<R> => ({
  status: 'failed',
  rawReceipt,
})

/**
 * Either a {@link FailedReceipt} or a {@link SuccessfulReceipt}.
 *
 * @remarks
 * If successful receipt, a parse method can be passed to return useful details about the transaction, used as `D`.
 *
 * @public
 */
export type MinedReceipt<R = unknown, D = unknown> = FailedReceipt<R> | SuccessfulReceipt<R, D>

/**
 * Indicates that the transaction has succeeded.
 *
 * @remarks
 * The `rawReceipt` property is an implementation-specific transaction receipt object.
 *
 * The `details` property may contain more information about the transaction.
 * See the return types of {@link TransactableRmm} functions for the exact contents of `details`
 * for each type of Rmm transaction.
 *
 * Returned by {@link SentRmmTransaction.getReceipt} and
 * {@link SentRmmTransaction.waitForReceipt}.
 *
 * @public
 */
export type SuccessfulReceipt<R = unknown, D = unknown> = {
  status: 'succeeded'
  rawReceipt: R
  details: D
}

/** @internal */
export const _successfulReceipt = <R, D>(
  rawReceipt: R,
  details: D,
  toString?: () => string,
): SuccessfulReceipt<R, D> => ({
  status: 'succeeded',
  rawReceipt,
  details,
  ...(toString ? { toString } : {}),
})

/**
 * One of either a {@link PendingReceipt}, a {@link FailedReceipt} or a {@link SuccessfulReceipt}.
 *
 * @public
 */
export type RmmReceipt<R = unknown, D = unknown> = PendingReceipt | MinedReceipt<R, D>

// --- Interfaces ---

export interface SentRmmTransaction<S = unknown, T extends RmmReceipt = RmmReceipt> {
  /** Implementable sent transaction object. */
  readonly rawSentTransaction: S

  /**
   * Check whether the transaction has been mined.
   *
   * @public
   */
  getReceipt(): Promise<T>

  /**
   * Wait for the transaction to be mined.
   *
   * @public
   */
  waitForReceipt(): Promise<Extract<T, MinedReceipt>>
}

export interface SendableRmm<R = unknown, S = unknown> {}

// --- Classes ---

/**
 * Ethers implementation of {@link SendableRmm}
 *
 * @beta
 */
export class SendableEthersRmm implements SendableRmm<EthersTransactionReceipt, EthersTransactionResponse> {
  private _populate: PopulatableEthersRmm

  constructor(populate: PopulatableEthersRmm) {
    this._populate = populate
  }
}
