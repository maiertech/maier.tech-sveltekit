import { error, fail } from '@sveltejs/kit';
import { unsubscribe } from '$lib/utils/eo-api';
import { eoApiErrorSchema, unsubscribeFormSchema } from '$lib/schemas';

const SUCCESS_MESSAGE = 'You have unsubscribed from my newsletter.';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		const result = unsubscribeFormSchema.safeParse(data);

		if (!result.success) {
			const { fieldErrors: errors } = result.error.flatten();
			return fail(400, {
				errors,
				data
			});
		}

		const validated_data = result.data;

		// Try to unsubscribe.
		const response = await unsubscribe(validated_data.email_address);

		if (!response.ok) {
			const result = eoApiErrorSchema.safeParse(await response.json());

			if (!result.success) {
				error(500, 'Unsubscription failed.');
			}

			// No explicit fail to avoid disclosing subscription status.
		}

		return { message: SUCCESS_MESSAGE };
	}
};
