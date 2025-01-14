import type * as Indy from 'indy-sdk'

import { Lifecycle, scoped } from 'tsyringe'

import { AgentConfig } from '../../../agent/AgentConfig'
import { IndySdkError } from '../../../error'
import { isIndyError } from '../../../utils/indyError'

@scoped(Lifecycle.ContainerScoped)
export class IndyVerifierService {
  private indy: typeof Indy

  public constructor(agentConfig: AgentConfig) {
    this.indy = agentConfig.agentDependencies.indy
  }

  public async verifyProof({
    proofRequest,
    proof,
    schemas,
    credentialDefinitions,
    revocationRegistryDefinitions = {},
    revocationStates = {},
  }: VerifyProofOptions): Promise<boolean> {
    try {
      return await this.indy.verifierVerifyProof(
        proofRequest,
        proof,
        schemas,
        credentialDefinitions,
        revocationRegistryDefinitions,
        revocationStates
      )
    } catch (error) {
      if (isIndyError(error)) {
        throw new IndySdkError(error)
      }

      throw error
    }
  }
}

export interface VerifyProofOptions {
  proofRequest: Indy.IndyProofRequest
  proof: Indy.IndyProof
  schemas: Indy.Schemas
  credentialDefinitions: Indy.CredentialDefs
  revocationRegistryDefinitions?: Indy.RevRegsDefs
  revocationStates?: Indy.RevStates
}
