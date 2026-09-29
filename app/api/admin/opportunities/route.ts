import { NextResponse } from 'next/server';
import { approveOpportunityById, rejectOpportunityById, getAllOpportunitiesIncludingPending } from '../../../../src/lib/opportunities';

export async function GET() {
  const opps = getAllOpportunitiesIncludingPending();
  return NextResponse.json(opps);
}

export async function PATCH(request: Request) {
  try {
    const { id, action } = await request.json();
    
    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    if (action === 'approve') {
      const success = approveOpportunityById(id);
      if (success) {
        return NextResponse.json({ success: true, message: 'Approved' });
      } else {
        return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
      }
    } else if (action === 'reject') {
      const success = rejectOpportunityById(id);
      if (success) {
        return NextResponse.json({ success: true, message: 'Rejected' });
      } else {
        return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
